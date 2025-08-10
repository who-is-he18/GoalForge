# app/models.py

from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from app.extensions import db

# ---------------------------
# User Model
# ---------------------------
class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    password_hash = db.Column(db.String, nullable=False)
    xp = db.Column(db.Integer, default=0)
    level = db.Column(db.Integer, default=1)
    profile_pic = db.Column(db.String, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    goals = db.relationship('Goal', backref='user', lazy=True)
    cheers = db.relationship('Cheer', backref='user', lazy=True)
    comments = db.relationship('Comment', backref='user', lazy=True)
    badges = db.relationship('UserBadge', backref='user', lazy=True)
    notifications = db.relationship('Notification', backref='user', lazy=True)
    following = db.relationship('Follower', backref='follower', lazy=True)

    # Password helper methods
    def set_password(self, password):
        """Hashes and sets the user's password."""
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        """Checks the user's password against the stored hash."""
        return check_password_hash(self.password_hash, password)


# ---------------------------
# Goal Model
# ---------------------------
class Goal(db.Model):
    __tablename__ = 'goals'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    title = db.Column(db.String, nullable=False)
    description = db.Column(db.Text, nullable=True)
    category = db.Column(db.String, default='General')
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=True)
    frequency = db.Column(db.String, nullable=False, default='daily')
    is_public = db.Column(db.Boolean, default=True, nullable=False)
    streak_count = db.Column(db.Integer, default=0)
    longest_streak = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    progress_logs = db.relationship('GoalProgress', backref='goal', lazy=True)
    followers = db.relationship('Follower', backref='goal', lazy=True)


# ---------------------------
# Goal Progress Model
# ---------------------------
class GoalProgress(db.Model):
    __tablename__ = 'goal_progress'

    id = db.Column(db.Integer, primary_key=True)
    goal_id = db.Column(db.Integer, db.ForeignKey('goals.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    note = db.Column(db.Text, nullable=True)
    media_url = db.Column(db.String, nullable=True)
    xp_earned = db.Column(db.Integer, default=10)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    cheers = db.relationship('Cheer', backref='goal_progress', lazy=True)
    comments = db.relationship('Comment', backref='goal_progress', lazy=True)


# ---------------------------
# Follower Model
# ---------------------------
class Follower(db.Model):
    __tablename__ = 'followers'

    id = db.Column(db.Integer, primary_key=True)
    follower_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    followed_goal_id = db.Column(db.Integer, db.ForeignKey('goals.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


# ---------------------------
# Cheer Model
# ---------------------------
class Cheer(db.Model):
    __tablename__ = 'cheers'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    goal_progress_id = db.Column(db.Integer, db.ForeignKey('goal_progress.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


# ---------------------------
# Comment Model
# ---------------------------
class Comment(db.Model):
    __tablename__ = 'comments'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    goal_progress_id = db.Column(db.Integer, db.ForeignKey('goal_progress.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


# ---------------------------
# Badge Model
# ---------------------------
class Badge(db.Model):
    __tablename__ = 'badges'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.Text, nullable=True)
    icon_url = db.Column(db.String, nullable=True)

    # Relationship to users who earned the badge
    earned_by = db.relationship('UserBadge', backref='badge', lazy=True)


# ---------------------------
# UserBadge Model (association between User and Badge)
# ---------------------------
class UserBadge(db.Model):
    __tablename__ = 'user_badges'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    badge_id = db.Column(db.Integer, db.ForeignKey('badges.id'), nullable=False)
    awarded_at = db.Column(db.DateTime, default=datetime.utcnow)


# ---------------------------
# Notification Model
# ---------------------------
class Notification(db.Model):
    __tablename__ = 'notifications'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    type = db.Column(db.String, nullable=False)  # e.g., 'missed_log', 'new_cheer'
    reference_id = db.Column(db.Integer, nullable=True)  # Optional reference to related object
    is_read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


# ---------------------------
# Token Blocklist Model (for JWT revocation)
# ---------------------------
class TokenBlocklist(db.Model):
    __tablename__ = 'token_blocklist'

    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(36), nullable=False, index=True, unique=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
