# Import necessary Flask extensions
from flask_sqlalchemy import SQLAlchemy      # For database ORM
from flask_marshmallow import Marshmallow    # For object serialization/deserialization
from flask_migrate import Migrate            # For handling database migrations
from flask_jwt_extended import JWTManager    # For JWT authentication

# Initialize Flask extension instances (to be initialized with app later)
db = SQLAlchemy()       # Database instance
ma = Marshmallow()      # Marshmallow instance for serialization
migrate = Migrate()     # Migration engine instance
jwt = JWTManager()      # JWT manager instance
