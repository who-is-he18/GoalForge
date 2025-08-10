from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
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
        load_instance = True      # Deserialize to model instances
        include_fk = True         # Include foreign keys in serialization

# Goal model schema
class GoalSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Goal
        load_instance = True
        include_fk = True

# GoalProgress model schema
class GoalProgressSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = GoalProgress
        load_instance = True
        include_fk = True

# Comment model schema
class CommentSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Comment
        load_instance = True
        include_fk = True

# Cheer model schema
class CheerSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Cheer
        load_instance = True
        include_fk = True

# Badge model schema
class BadgeSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Badge
        load_instance = True
        include_fk = True

# UserBadge model schema
class UserBadgeSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = UserBadge
        load_instance = True
        include_fk = True

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
