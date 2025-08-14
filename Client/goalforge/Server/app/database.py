"""
This script initializes the database for the Flask application.
It drops all existing tables and recreates them based on the current models.
Use with caution in production environments as it will erase all existing data.
"""

# Import the application factory and database instance
from app import create_app
from app.extensions import db

# Import all models to ensure their tables are created
from app.models import *

# Create a Flask application instance
app = create_app()

# Use the application context to interact with the database
with app.app_context():
    # Drop all existing tables (WARNING: This deletes all data)
    db.drop_all()
    # Create all tables as defined in the models
    db.create_all()
    # Print confirmation message
    print("Database tables created.")
