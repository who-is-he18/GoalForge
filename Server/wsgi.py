# Server/wsgi.py
# Simple WSGI entrypoint for Gunicorn / Render

from app import create_app

# Create the Flask app once on cold start
app = create_app()
