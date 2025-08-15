# ===========================
# Import Resource Classes
# ===========================

# Core resource endpoints
from .core_routes import (
    UserListResource,           # Handles user-related endpoints
    GoalListResource,           # Handles goal-related endpoints
    GoalProgressListResource,   # Handles goal progress endpoints
    FollowerListResource,       # Handles follower-related endpoints
    CheerListResource,          # Handles cheer-related endpoints
    CommentListResource,        # Handles comment-related endpoints
    BadgeListResource,          # Handles badge-related endpoints
    UserBadgeListResource,      # Handles user-badge endpoints
    NotificationListResource,   # Handles notification endpoints
    GoalResource,               # Handles individual goal operations
    GoalProgressResource,        # Handles individual goal progress operations
    CommentResource,         # Handles individual comment operations
    CheerResource,           # Handles individual cheer operations
    BadgeResource,           # Handles individual badge operations
    UserBadgeResource,       # Handles individual user-badge operations
    FollowerResource,        # Handles individual follower operations
    NotificationResource       # Handles individual notification operations
)

# Authentication and user management endpoints
from .auth_routes import (
    RegisterResource,           # Handles user registration
    LoginResource,              # Handles user login
    LogoutResource,             # Handles user logout
    UpdateUserResource,         # Handles updating user details
    DeleteUserResource,         # Handles deleting a user
    AdminUserResource           # Handles admin operations on users
)

# ===========================
# Route Registration Function
# ===========================

# app/routes.py (or wherever register_routes is defined)
def register_routes(api):
    """
    Register all API resource routes with the Flask-RESTful API instance.
    All endpoints are namespaced under /api for consistency and CORS coverage.
    Make sure the Resource classes (e.g., RegisterResource, UserListResource, etc.)
    are imported or available in this module.
    """

    # User management endpoints
    api.add_resource(UserListResource, '/api/users')                         # User CRUD operations
    api.add_resource(UpdateUserResource, '/api/users/me')                    # Update user details
    api.add_resource(DeleteUserResource, '/api/users/delete')                # Delete user account
    api.add_resource(AdminUserResource, '/api/admin/users/<int:user_id>')    # Admin user ops

    # Authentication endpoints
    api.add_resource(RegisterResource, '/api/users/register')                # User registration
    api.add_resource(LoginResource, '/api/auth/login')                       # User login
    api.add_resource(LogoutResource, '/api/auth/logout')                     # User logout

    # Social features
    api.add_resource(FollowerListResource, '/api/followers')                 # Manage followers
    api.add_resource(FollowerResource, '/api/followers/<int:follower_id>')
    api.add_resource(CheerListResource, '/api/cheers')                       # All cheers
    api.add_resource(CheerResource, '/api/cheers/<int:cheer_id>')            # Single cheer
    api.add_resource(CommentListResource, '/api/comments')                   # Add/view comments
    api.add_resource(CommentResource, '/api/comments/<int:comment_id>')     # Single comment

    # Badge and notification endpoints
    api.add_resource(BadgeListResource, '/api/badges')                       # All badges
    api.add_resource(BadgeResource, '/api/badges/<int:badge_id>')            # Single badge
    api.add_resource(UserBadgeListResource, '/api/user-badges')              # All user badges
    api.add_resource(UserBadgeResource, '/api/user-badges/<int:user_badge_id>')  # Single user badge
    api.add_resource(NotificationListResource, '/api/notifications')         # Notification management
    api.add_resource(NotificationResource, '/api/notifications/<int:notification_id>')

    # Goal and progress endpoints
    api.add_resource(GoalListResource, '/api/goals')                         # List/create goals
    api.add_resource(GoalResource, '/api/goals/<int:goal_id>')               # Individual goal ops
    api.add_resource(GoalProgressListResource, '/api/progress')              # List/create progress
    api.add_resource(GoalProgressResource, '/api/progress/<int:progress_id>')# Progress ops


