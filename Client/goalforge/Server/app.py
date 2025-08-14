# Import the create_app factory function from the app module
from app import create_app

# Create an instance of the Flask application
app = create_app()

# Run the Flask development server if this file is executed directly
if __name__ == "__main__":
    app.run(debug=True)  # Enable debug mode for development
