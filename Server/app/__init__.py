import os
from dotenv import load_dotenv
from flask import Flask, jsonify
from flask_restful import Api
from flask_cors import CORS

# local imports (extensions and models)
from app.extensions import db, migrate, jwt
from app.models import TokenBlocklist  # token revocation model

def create_app():
    load_dotenv()

    app = Flask(__name__, instance_relative_config=False)

    # Basic config (override with environment variables)
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL", "sqlite:///goalforge.db")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "super-secret-key")
    # Keep blacklist checks enabled (adjust to your auth design)
    app.config["JWT_BLACKLIST_ENABLED"] = True
    app.config["JWT_BLACKLIST_TOKEN_CHECKS"] = ["access", "refresh"]

    # CORS: allow the Vite/react dev server by default (change in production)
    # FRONTEND_ORIGINS can be comma-separated list like "http://localhost:5173,http://localhost:3000"
    origins = os.getenv("FRONTEND_ORIGINS", "http://localhost:5173").split(",")
    CORS(app, resources={r"/api/*": {"origins": origins}}, supports_credentials=True)

    # initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    api = Api(app)

    # token revoked check for flask-jwt-extended (signature matches library expectations)
    @jwt.token_in_blocklist_loader
    def check_if_token_revoked(jwt_header, jwt_payload):
        jti = jwt_payload.get("jti")
        if not jti:
            return True
        return db.session.query(TokenBlocklist.id).filter_by(jti=jti).scalar() is not None

    # lightweight health route for quick frontend checks
    @app.route("/api/health")
    def health():
        return jsonify(status="ok", service="goalforge-api")

    # register API resources
    from .routes import register_routes
    register_routes(api)

    return app
