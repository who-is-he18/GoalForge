from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from marshmallow_sqlalchemy.fields import Nested
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema, auto_field, fields


from app.models import (
    User,
    Goal,
    GoalProgress,
    Comment,
    Cheer,
    Badge,
    UserBadge,
    Follower,
    Notification
)

# ===========================
# Marshmallow SQLAlchemy Schemas
# ===========================

# User model schema
class UserSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = User
        load_instance = True
        include_fk = True
        exclude = (
            "password_hash",
            "goals",
            "cheers",
            "comments",
            "badges",
            "notifications",
            "following",
        )

# GoalProgress model schema
class GoalProgressSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = GoalProgress
        load_instance = True
        include_fk = True

# Goal model schema
class GoalSchema(SQLAlchemyAutoSchema):
    user = Nested(UserSchema, only=("id", "username", "profile_pic"))
    progress_logs = Nested(GoalProgressSchema, many=True)  # Add this line
    
    class Meta:
        model = Goal
        load_instance = True
        include_fk = True



# Comment schema with nested user
class CommentSchema(SQLAlchemyAutoSchema):
    user = Nested(UserSchema, only=("id", "username", "profile_pic"))

    class Meta:
        model = Comment
        load_instance = True
        include_fk = True

# Cheer schema with nested user
class CheerSchema(SQLAlchemyAutoSchema):
    user = Nested(UserSchema, only=("id", "username", "profile_pic"))

    class Meta:
        model = Cheer
        load_instance = True
        include_fk = True

class BadgeSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Badge
        include_fk = True
        load_instance = True

    id = auto_field()
    name = auto_field()
    description = auto_field()
    icon_url = auto_field()

class UserBadgeSchema(SQLAlchemyAutoSchema):
    badge = fields.Nested(BadgeSchema)  # include nested badge payload

    class Meta:
        model = UserBadge
        include_fk = True
        load_instance = True

    id = auto_field()
    user_id = auto_field()
    badge_id = auto_field()
    awarded_at = auto_field()

# Follower model schema
class FollowerSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Follower
        load_instance = True
        include_fk = True

# Notification model schema
class NotificationSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Notification
        load_instance = True
        include_fk = True

# ===========================
# Schema Instances for Serialization/Deserialization
# ===========================

# Goal schemas
goal_schema = GoalSchema()                       # For single goal
goals_schema = GoalSchema(many=True)             # For list of goals

# GoalProgress schemas
progress_schema = GoalProgressSchema()           # For single progress log
progresses_schema = GoalProgressSchema(many=True) # For list of progress logs
