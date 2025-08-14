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
user_schema = UserSchema()                   # Single user
users_schema = UserSchema(many=True)         # Multiple users
comment_schema = CommentSchema()             # Single comment
comments_schema = CommentSchema(many=True)   # Multiple comments
cheer_schema = CheerSchema()                 # Single cheer
cheers_schema = CheerSchema(many=True)       # Multiple cheers
badge_schema = BadgeSchema()                 # Single badge
badges_schema = BadgeSchema(many=True)       # Multiple badges
user_badge_schema = UserBadgeSchema()        # Single user badge
user_badges_schema = UserBadgeSchema(many=True) # Multiple user badges
follower_schema = FollowerSchema()           # Single follower
followers_schema = FollowerSchema(many=True) # Multiple followers
notification_schema = NotificationSchema()   # Single notification
notifications_schema = NotificationSchema(many=True) # Multiple notifications

# ------------------- User Resources -------------------

class UserListResource(Resource):
    """Resource for listing all users."""
    def get(self):
        users = User.query.all()
        return users_schema.dump(users), 200

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
        return comments_schema.dump(comments), 200
    
    @jwt_required()
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('user_id', type=int, required=True)
        parser.add_argument('goal_progress_id', type=int, required=True)
        parser.add_argument('content', required=True)
        args = parser.parse_args()

        comment = Comment(
            user_id=args['user_id'],
            goal_progress_id=args['goal_progress_id'],
            content=args['content']
        )
        db.session.add(comment)
        db.session.commit()
        return comment_schema.dump(comment), 201
    
class CommentResource(Resource):
    """Resource for retrieving, updating, or deleting a single comment."""
    def get(self, comment_id):
        comment = Comment.query.get_or_404(comment_id)
        return comment_schema.dump(comment), 200

    @jwt_required()
    def put(self, comment_id):
        comment = Comment.query.get_or_404(comment_id)
        parser = reqparse.RequestParser()
        parser.add_argument('content')
        args = parser.parse_args()

        # Update only provided fields
        for attr, value in args.items():
            if value is not None:
                setattr(comment, attr, value)

        db.session.commit()
        return comment_schema.dump(comment), 200

    @jwt_required()
    def delete(self, comment_id):
        comment = Comment.query.get_or_404(comment_id)
        db.session.delete(comment)
        db.session.commit()
        return {"message": "Comment deleted"}, 200

class CheerListResource(Resource):
    """Resource for listing all cheers."""
    def get(self):
        cheers = Cheer.query.all()
        return cheers_schema.dump(cheers), 200

    @jwt_required()
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('user_id', type=int, required=True)
        parser.add_argument('goal_progress_id', type=int, required=True)
        args = parser.parse_args()

        cheer = Cheer(
            user_id=args['user_id'],
            goal_progress_id=args['goal_progress_id']
        )
        db.session.add(cheer)
        db.session.commit()
        return cheer_schema.dump(cheer), 201

class CheerResource(Resource):
    """Resource for retrieving, updating, or deleting a single cheer."""
    def get(self, cheer_id):
        cheer = Cheer.query.get_or_404(cheer_id)
        return cheer_schema.dump(cheer), 200
    
    @jwt_required()
    def put(self, cheer_id):
        cheer = Cheer.query.get_or_404(cheer_id)
        parser = reqparse.RequestParser()
        parser.add_argument('user_id', type=int)
        parser.add_argument('goal_progress_id', type=int)
        args = parser.parse_args()

        # Update only provided fields
        for attr, value in args.items():
            if value is not None:
                setattr(cheer, attr, value)

        db.session.commit()
        return cheer_schema.dump(cheer), 200

    @jwt_required()
    def delete(self, cheer_id):
        cheer = Cheer.query.get_or_404(cheer_id)
        db.session.delete(cheer)
        db.session.commit()
        return {"message": "Cheer deleted"}, 200

class BadgeListResource(Resource):
    """Resource for listing all badges."""
    def get(self):
        badges = Badge.query.all()
        return badges_schema.dump(badges), 200
    
    @jwt_required()
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('name', required=True)
        parser.add_argument('description', required=True)
        args = parser.parse_args()

        badge = Badge(
            name=args['name'],
            description=args['description']
        )
        db.session.add(badge)
        db.session.commit()
        return badge_schema.dump(badge), 201

class BadgeResource(Resource):
    """Resource for retrieving, updating, or deleting a single badge."""
    def get(self, badge_id):
        badge = Badge.query.get_or_404(badge_id)
        return badge_schema.dump(badge), 200
    @jwt_required()
    def put(self, badge_id):
        badge = Badge.query.get_or_404(badge_id)
        parser = reqparse.RequestParser()
        parser.add_argument('name')
        parser.add_argument('description')
        args = parser.parse_args()

        # Update only provided fields
        for attr, value in args.items():
            if value is not None:
                setattr(badge, attr, value)

        db.session.commit()
        return badge_schema.dump(badge), 200

    @jwt_required()
    def delete(self, badge_id):
        badge = Badge.query.get_or_404(badge_id)
        db.session.delete(badge)
        db.session.commit()
        return {"message": "Badge deleted"}, 200

class UserBadgeListResource(Resource):
    """Resource for listing all user badges."""
    def get(self):
        user_badges = UserBadge.query.all()
        return user_badges_schema.dump(user_badges), 200

    @jwt_required()
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('user_id', type=int, required=True)
        parser.add_argument('badge_id', type=int, required=True)
        args = parser.parse_args()

        user_badge = UserBadge(
            user_id=args['user_id'],
            badge_id=args['badge_id']
        )
        db.session.add(user_badge)
        db.session.commit()
        return user_badge_schema.dump(user_badge), 201
    
class UserBadgeResource(Resource):
    """Resource for retrieving, updating, or deleting a single user badge."""
    def get(self, user_badge_id):
        user_badge = UserBadge.query.get_or_404(user_badge_id)
        return user_badge_schema.dump(user_badge), 200
    
    @jwt_required()
    def put(self, user_badge_id):
        user_badge = UserBadge.query.get_or_404(user_badge_id)
        parser = reqparse.RequestParser()
        parser.add_argument('user_id', type=int)
        parser.add_argument('badge_id', type=int)
        args = parser.parse_args()

        # Update only provided fields
        for attr, value in args.items():
            if value is not None:
                setattr(user_badge, attr, value)

        db.session.commit()
        return user_badge_schema.dump(user_badge), 200

    @jwt_required()
    def delete(self, user_badge_id):
        user_badge = UserBadge.query.get_or_404(user_badge_id)
        db.session.delete(user_badge)
        db.session.commit()
        return {"message": "User badge deleted"}, 200

class FollowerListResource(Resource):
    """Resource for listing all followers."""
    def get(self):
        followers = Follower.query.all()
        return followers_schema.dump(followers), 200
    
    @jwt_required()
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('follower_id', type=int, required=True)
        parser.add_argument('followed_goal_id', type=int, required=True)  # match model
        args = parser.parse_args()

        follower = Follower(
        follower_id=args['follower_id'],
        followed_goal_id=args['followed_goal_id']
        )
        db.session.add(follower)
        db.session.commit()
        return follower_schema.dump(follower), 201


class FollowerResource(Resource):
    """Resource for retrieving, updating, or deleting a single follower."""
    def get(self, follower_id):
        follower = Follower.query.get_or_404(follower_id)
        return follower_schema.dump(follower), 200
    
    @jwt_required()
    def put(self, follower_id):
        follower = Follower.query.get_or_404(follower_id)
        parser = reqparse.RequestParser()
        parser.add_argument('follower_id', type=int)
        parser.add_argument('followed_id', type=int)
        args = parser.parse_args()

        # Update only provided fields
        for attr, value in args.items():
            if value is not None:
                setattr(follower, attr, value)

        db.session.commit()
        return follower_schema.dump(follower), 200

    @jwt_required()
    def delete(self, follower_id):
        follower = Follower.query.get_or_404(follower_id)
        db.session.delete(follower)
        db.session.commit()
        return {"message": "Follower deleted"}, 200

class NotificationListResource(Resource):
    """Resource for listing all notifications."""
    def get(self):
        notifications = Notification.query.all()
        return notifications_schema.dump(notifications), 200
    
    @jwt_required()
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('user_id', type=int, required=True)
        parser.add_argument('type', type=str, required=True)
        parser.add_argument('reference_id', type=int)
        args = parser.parse_args()

        notification = Notification(
            user_id=args['user_id'],
            type=args['type'],
            reference_id=args['reference_id']
        )
        db.session.add(notification)
        db.session.commit()
        return notification_schema.dump(notification), 201

class NotificationResource(Resource):
    """Resource for retrieving, updating, or deleting a single notification."""
    def get(self, notification_id):
        notification = Notification.query.get_or_404(notification_id)
        return notification_schema.dump(notification), 200
    
    @jwt_required()
    def put(self, notification_id):
        notification = Notification.query.get_or_404(notification_id)
        parser = reqparse.RequestParser()
        parser.add_argument('user_id', type=int)
        parser.add_argument('type', type=str)
        parser.add_argument('reference_id', type=int)
        parser.add_argument('is_read', type=lambda x: str(x).lower() == 'true')
        args = parser.parse_args()

        # Update only provided fields
        for attr, value in args.items():
            if value is not None:
                setattr(notification, attr, value)

        db.session.commit()
        return notification_schema.dump(notification), 200
    
    @jwt_required()
    def delete(self, notification_id):
        notification = Notification.query.get_or_404(notification_id)
        db.session.delete(notification)
        db.session.commit()
        return {"message": "Notification deleted"}, 200