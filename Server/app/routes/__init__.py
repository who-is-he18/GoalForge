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
    GoalProgressResource        # Handles individual goal progress operations
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

def register_routes(api):
    """
    Register all API resource routes with the Flask-RESTful API instance.
    """
    # User management endpoints
    api.add_resource(UserListResource, '/users')                   # User CRUD operations
    api.add_resource(UpdateUserResource, '/users/me')              # Update user details
    api.add_resource(DeleteUserResource, '/api/user/delete')       # Delete user account
    api.add_resource(AdminUserResource, '/api/admin/user/<int:user_id>')  # Admin user ops

    # Authentication endpoints
    api.add_resource(RegisterResource, '/register')                # User registration
    api.add_resource(LoginResource, '/login')                      # User login
    api.add_resource(LogoutResource, '/logout')                    # User logout

    # Social features
    api.add_resource(FollowerListResource, '/followers')           # Manage followers
    api.add_resource(CheerListResource, '/cheers')                 # Send/receive cheers
    api.add_resource(CommentListResource, '/comments')             # Add/view comments

    # Badge and notification endpoints
    api.add_resource(BadgeListResource, '/badges')                 # Badge management
    api.add_resource(UserBadgeListResource, '/user-badges')        # Assign/view user badges
    api.add_resource(NotificationListResource, '/notifications')   # Notification management

    # Goal and progress endpoints
    api.add_resource(GoalListResource, '/api/goals')               # List/create goals
    api.add_resource(GoalResource, '/api/goals/<int:goal_id>')     # Individual goal ops
    api.add_resource(GoalProgressListResource, '/api/progress')    # List/create progress
    api.add_resource(GoalProgressResource, '/api/progress/<int:progress_id>')  # Progress ops

