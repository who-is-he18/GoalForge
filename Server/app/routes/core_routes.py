# Flask RESTful API resources for GoalForge core models

from flask_restful import Resource, reqparse
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import request
from app.models import (
    User, Goal, GoalProgress, Comment, Cheer,
    Badge, UserBadge, Follower, Notification
)
from app.resources.serializers import (
    UserSchema, GoalSchema, GoalProgressSchema,
    CommentSchema, CheerSchema, BadgeSchema,
    UserBadgeSchema, FollowerSchema, NotificationSchema,
    goal_schema, goals_schema, progress_schema, progresses_schema
)
from app.extensions import db
from datetime import datetime

# Initialize Marshmallow schemas for serialization
goal_schema = GoalSchema()                   # Single goal
goals_schema = GoalSchema(many=True)         # Multiple goals
progress_schema = GoalProgressSchema(many=True)
progress_single_schema = GoalProgressSchema()
user_schema = UserSchema(many=True)
comment_schema = CommentSchema(many=True)
cheer_schema = CheerSchema(many=True)
badge_schema = BadgeSchema(many=True)
user_badge_schema = UserBadgeSchema(many=True)
follower_schema = FollowerSchema(many=True)
notification_schema = NotificationSchema(many=True)

# ------------------- User Resources -------------------

class UserListResource(Resource):
    """Resource for listing all users."""
    def get(self):
        users = User.query.all()
        return user_schema.dump(users), 200

# ------------------- Goal Resources -------------------

class GoalListResource(Resource):
    """Resource for listing and creating goals."""
    def get(self):
        goals = Goal.query.all()
        return goals_schema.dump(goals), 200

    @jwt_required()
    def post(self):
        user_id = get_jwt_identity()
        data = request.get_json()

        # Parse date strings into datetime.date objects
        start_date = datetime.strptime(data.get("start_date"), "%Y-%m-%d").date() if data.get("start_date") else None
        end_date = datetime.strptime(data.get("end_date"), "%Y-%m-%d").date() if data.get("end_date") else None

        goal = Goal(
            user_id=user_id,
            title=data["title"],
            description=data.get("description"),
            category=data.get("category"),
            start_date=start_date,
            end_date=end_date,
            frequency=data.get("frequency"),
            is_public=data.get("is_public", True),
        )
        db.session.add(goal)
        db.session.commit()
        return goal_schema.dump(goal), 201

class GoalResource(Resource):
    """Resource for retrieving, updating, or deleting a single goal."""
    def get(self, goal_id):
        goal = Goal.query.get_or_404(goal_id)
        return goal_schema.dump(goal), 200

    @jwt_required()
    def put(self, goal_id):
        goal = Goal.query.get_or_404(goal_id)
        parser = reqparse.RequestParser()
        parser.add_argument('title')
        parser.add_argument('description')
        parser.add_argument('category')
        parser.add_argument('start_date')
        parser.add_argument('end_date')
        parser.add_argument('frequency')
        parser.add_argument('is_public', type=bool)
        args = parser.parse_args()

        # Update only provided fields
        for attr, value in args.items():
            if value is not None:
                setattr(goal, attr, value)

        db.session.commit()
        return goal_schema.dump(goal), 200

    @jwt_required()
    def delete(self, goal_id):
        goal = Goal.query.get_or_404(goal_id)
        db.session.delete(goal)
        db.session.commit()
        return {"message": "Goal deleted"}, 200

# ------------------- Goal Progress Resources -------------------

class GoalProgressListResource(Resource):
    """Resource for listing and creating progress logs."""
    def get(self):
        progress_logs = GoalProgress.query.all()
        return progresses_schema.dump(progress_logs), 200

    @jwt_required()
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('goal_id', type=int, required=True)
        parser.add_argument('date', required=True)
        parser.add_argument('note')
        parser.add_argument('media_url')
        parser.add_argument('xp_earned', type=int, default=10)
        args = parser.parse_args()

        # Convert date string to Python date object
        date_obj = datetime.strptime(args['date'], "%Y-%m-%d").date()

        progress = GoalProgress(
            goal_id=args['goal_id'],
            date=date_obj,
            note=args['note'],
            media_url=args['media_url'],
            xp_earned=args['xp_earned']
        )

        db.session.add(progress)
        db.session.commit()
        return progress_single_schema.dump(progress), 201

class GoalProgressResource(Resource):
    """Resource for retrieving, updating, or deleting a single progress log."""
    def get(self, progress_id):
        progress = GoalProgress.query.get_or_404(progress_id)
        return progress_single_schema.dump(progress), 200

    @jwt_required()
    def put(self, progress_id):
        progress = GoalProgress.query.get_or_404(progress_id)
        parser = reqparse.RequestParser()
        parser.add_argument('date')
        parser.add_argument('note')
        parser.add_argument('media_url')
        parser.add_argument('xp_earned', type=int)
        args = parser.parse_args()

        # Update only provided fields
        for attr, value in args.items():
            if value is not None:
                setattr(progress, attr, value)

        db.session.commit()
        return progress_single_schema.dump(progress), 200

    @jwt_required()
    def delete(self, progress_id):
        progress = GoalProgress.query.get_or_404(progress_id)

        # Delete related cheers
        Cheer.query.filter_by(goal_progress_id=progress.id).delete()
        # Delete related comments
        Comment.query.filter_by(goal_progress_id=progress.id).delete()
        # Delete the progress log itself
        db.session.delete(progress)
        db.session.commit()

        return {"message": "Progress log and related data deleted successfully."}, 200

# ------------------- Other List Resources -------------------

class CommentListResource(Resource):
    """Resource for listing all comments."""
    def get(self):
        comments = Comment.query.all()
        return comment_schema.dump(comments), 200

class CheerListResource(Resource):
    """Resource for listing all cheers."""
    def get(self):
        cheers = Cheer.query.all()
        return cheer_schema.dump(cheers), 200

class BadgeListResource(Resource):
    """Resource for listing all badges."""
    def get(self):
        badges = Badge.query.all()
        return badge_schema.dump(badges), 200

class UserBadgeListResource(Resource):
    """Resource for listing all user badges."""
    def get(self):
        user_badges = UserBadge.query.all()
        return user_badge_schema.dump(user_badges), 200

class FollowerListResource(Resource):
    """Resource for listing all followers."""
    def get(self):
        followers = Follower.query.all()
        return follower_schema.dump(followers), 200

class NotificationListResource(Resource):
    """Resource for listing all notifications."""
    def get(self):
        notifications = Notification.query.all()
        return notification_schema.dump(notifications), 200
