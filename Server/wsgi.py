# Server/wsgi.py
# WSGI entrypoint used by gunicorn / Render

from app import create_app

# create the Flask app once per process
app = create_app()
