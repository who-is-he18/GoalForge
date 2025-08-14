from flask import request, jsonify
from flask_restful import Resource
from flask_jwt_extended import (
    create_access_token, jwt_required, get_jwt, get_jwt_identity
)
from werkzeug.security import generate_password_hash
from datetime import timedelta
import re

from app.models import (
    db, User, Goal, GoalProgress, Cheer, Comment, Follower, UserBadge, Notification, TokenBlocklist
)
from app.extensions import db

# ---------------------------
# Authentication Resources
# ---------------------------

class RegisterResource(Resource):
    """
    Resource for user registration.
    Validates input, checks for existing users, and creates a new user.
    """
    def post(self):
        data = request.get_json()
        username = data.get("username")
        email = data.get("email")
        password = data.get("password")
        confirm_password = data.get("confirm_password")

        # Validate all fields are present
        if not all([username, email, password, confirm_password]):
            return {"message": "All fields are required."}, 400

        # Validate email format
        email_regex = r"^[\w\.-]+@[\w\.-]+\.\w+$"
        if not re.match(email_regex, email):
            return {"message": "Invalid email format."}, 400

        # Check password confirmation
        if password != confirm_password:
            return {"message": "Passwords do not match."}, 400

        # Validate password strength
        password_regex = r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$"
        if not re.match(password_regex, password):
            return {
                "message": "Password must be at least 8 characters long, contain uppercase and lowercase letters, a number, and a special character."
            }, 400

        # Check if username or email already exists
        if User.query.filter((User.username == username) | (User.email == email)).first():
            return {"message": "Username or email already exists."}, 409

        # Create user and hash password
        user = User(username=username, email=email)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()

        # Auto-login: generate JWT token
        access_token = create_access_token(identity=str(user.id))

        return {
            "message": "User registered successfully.",
            "access_token": access_token,
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email
            }
        }, 201


class LoginResource(Resource):
    """
    Resource for user login.
    Validates credentials and returns a JWT token.
    """
    def post(self):
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")

        # Validate required fields
        if not email or not password:
            return {"message": "Email and password are required."}, 400

        # Validate email format
        email_regex = r"^[\w\.-]+@[\w\.-]+\.\w+$"
        if not re.match(email_regex, email):
            return {"message": "Invalid email format."}, 400

        # Find user by email and check password
        user = User.query.filter_by(email=email).first()
        if not user or not user.check_password(password):
            return {"message": "Invalid email or password."}, 401

        # Generate JWT token (valid for 1 day)
        access_token = create_access_token(identity=str(user.id), expires_delta=timedelta(days=20))

        return {
            "message": "Login successful.",
            "access_token": access_token,
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "level": user.level,
                "xp": user.xp,
                "profile_pic": user.profile_pic
            }
        }, 200


class LogoutResource(Resource):
    """
    Resource for user logout.
    Blacklists the current JWT token.
    """
    @jwt_required()
    def post(self):
        jti = get_jwt()["jti"]  # JWT unique identifier
        db.session.add(TokenBlocklist(jti=jti))  # Add token to blocklist
        db.session.commit()
        return {"message": "Successfully logged out."}, 200


# ---------------------------
# Admin Resource
# ---------------------------

class AdminUserResource(Resource):
    """
    Resource for admin to delete a user by user_id.
    Only accessible by admin users (level 99).
    """
    @jwt_required()
    def delete(self, user_id):
        current_user = User.query.get(get_jwt_identity())
        # Check if current user is admin
        if not current_user or current_user.level != 99:
            return {"message": "Admin privileges required."}, 403

        user = User.query.get(user_id)
        if not user:
            return {"message": "User not found."}, 404

        db.session.delete(user)
        db.session.commit()
        return {"message": f"User {user.username} (ID: {user.id}) deleted successfully."}, 200


# ---------------------------
# User Profile Resources
# ---------------------------

class UpdateUserResource(Resource):
    """
    Resource for updating user profile.
    Allows updating username, email, profile_pic, and password.
    """
    @jwt_required()
    def put(self):
        user_id = get_jwt_identity()
        user = User.query.get_or_404(user_id)
        data = request.get_json()

        username = data.get("username")
        email = data.get("email")
        profile_pic = data.get("profile_pic")
        current_password = data.get("current_password")
        new_password = data.get("new_password")

        # Update fields if provided
        if username:
            user.username = username
        if email:
            user.email = email
        if profile_pic:
            user.profile_pic = profile_pic

        # Handle password change
        if new_password:
            # Require current password for security
            if not current_password or not user.check_password(current_password):
                return {"message": "Current password is incorrect."}, 400
            user.set_password(new_password)

        db.session.commit()

        return {
            "message": "User updated successfully.",
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "profile_pic": user.profile_pic,
                "xp": user.xp,
                "level": user.level
            }
        }, 200


class DeleteUserResource(Resource):
    """
    Resource for deleting the current user and all related data.
    Handles cascading deletes for goals, progress, cheers, comments, followers, badges, and notifications.
    """
    @jwt_required()
    def delete(self):
        user_id = get_jwt_identity()
        user = User.query.get_or_404(user_id)

        # Step 1: Delete all goal progress logs, cheers, and comments for user's goals
        for goal in user.goals:
            for progress in goal.progress_logs:
                # Delete cheers and comments on each progress log
                Cheer.query.filter_by(goal_progress_id=progress.id).delete()
                Comment.query.filter_by(goal_progress_id=progress.id).delete()
            # Delete the progress logs themselves
            GoalProgress.query.filter_by(goal_id=goal.id).delete()
            # Delete followers of this goal
            Follower.query.filter_by(followed_goal_id=goal.id).delete()

        # Step 2: Delete user's own cheers and comments (not on their goals)
        Cheer.query.filter_by(user_id=user.id).delete()
        Comment.query.filter_by(user_id=user.id).delete()

        # Step 3: Delete user’s badges and notifications
        UserBadge.query.filter_by(user_id=user.id).delete()
        Notification.query.filter_by(user_id=user.id).delete()

        # Step 4: Delete user's followers (i.e., goals they followed)
        Follower.query.filter_by(follower_id=user.id).delete()

        # Step 5: Delete the goals (handled by cascade, but just to be safe)
        Goal.query.filter_by(user_id=user.id).delete()

        # Step 6: Finally, delete the user
        db.session.delete(user)
        db.session.commit()

        return {"message": "User and related data deleted successfully."}, 200

