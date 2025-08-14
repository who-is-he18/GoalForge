# Import standard libraries
import os

# Import third-party libraries and extensions
from flask import Flask
from flask_restful import Api
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv

# Import app-specific modules
from app.extensions import db, migrate, jwt
from app.models import TokenBlocklist  # Model for JWT token blocklist

# Initialize migration object (to be attached to app later)
migrate = Migrate()

def create_app():
    """
    Application factory function to create and configure the Flask app.
    """
    # Load environment variables from .env file
    load_dotenv()

    # Create Flask app instance
    app = Flask(__name__)

    # Configure app settings
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///goalforge.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = 'super-secret-key'  # Change this in production!
    app.config['JWT_BLACKLIST_ENABLED'] = True
    app.config['JWT_BLACKLIST_TOKEN_CHECKS'] = ['access']

    # Initialize extensions with app
    db.init_app(app)
    migrate.init_app(app, db)
    jwt = JWTManager(app)

    # Initialize Flask-RESTful API
    api = Api(app)

    # JWT token blocklist check
    @jwt.token_in_blocklist_loader
    def check_if_token_revoked(_, jwt_payload):
        """
        Callback function to check if a JWT token has been revoked.
        Returns True if the token is found in the blocklist.
        """
        jti = jwt_payload["jti"]
        # Query the TokenBlocklist table for the token's jti
        return db.session.query(TokenBlocklist.id).filter_by(jti=jti).scalar() is not None

    # Import and register API routes from the routes module
    from .routes import register_routes
    register_routes(api)

    # Return the configured Flask app instance
    return app
