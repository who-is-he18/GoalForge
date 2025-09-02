import os
from dotenv import load_dotenv
from flask import Flask, jsonify
from flask import request, make_response

from flask_restful import Api
from flask_cors import CORS

# local imports (extensions and models)
from app.extensions import db, migrate, jwt
from app.models import TokenBlocklist  # token revocation model


def create_app():
    load_dotenv()

    # create Flask app
    app = Flask(__name__, instance_relative_config=False)

    # ----- Basic config (override with environment variables) -----
    # Database & JWT
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL", "sqlite:///instance/goalforge.db")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "super-secret-key")
    # Keep blacklist checks enabled (adjust to your auth design)
    app.config["JWT_BLACKLIST_ENABLED"] = True
    app.config["JWT_BLACKLIST_TOKEN_CHECKS"] = ["access", "refresh"]

    # ----- Static & uploads -----
    # allow overriding static folder and upload location via env vars
    static_folder = os.getenv("STATIC_FOLDER") or os.path.join(app.root_path, "static")
    upload_folder = os.getenv("UPLOAD_FOLDER") or os.path.join(static_folder, "uploads")

    # maximum request body size (default 5MB)
    try:
        app.config["MAX_CONTENT_LENGTH"] = int(os.getenv("MAX_CONTENT_LENGTH", 5 * 1024 * 1024))
    except Exception:
        app.config["MAX_CONTENT_LENGTH"] = 5 * 1024 * 1024

    app.config["STATIC_FOLDER"] = static_folder
    app.config["UPLOAD_FOLDER"] = upload_folder
    # allowed image extensions (helper for upload handling)
    app.config["ALLOWED_IMAGE_EXTENSIONS"] = {"png", "jpg", "jpeg", "gif", "webp"}

    # ensure static and upload directories exist
    try:
        os.makedirs(app.config["STATIC_FOLDER"], exist_ok=True)
        os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)
    except Exception:
        # don't raise here; just log if needed later
        pass

    # CORS: allow the Vite/react dev server by default (change in production)
    # FRONTEND_ORIGINS can be comma-separated list like "http://localhost:5173,http://localhost:3000"
    origins = os.getenv("FRONTEND_ORIGINS", "http://localhost:5173").split(",")
    CORS(
        app,
        resources={r"/api/*": {"origins": origins}},
        supports_credentials=True,
        methods=["GET", "HEAD", "POST", "OPTIONS", "PUT", "PATCH", "DELETE"],
        allow_headers=["Content-Type", "Authorization", "X-Requested-With"],
        expose_headers=["Content-Type", "Authorization"],
    )

    @app.before_request
    def handle_options():
        if request.method == "OPTIONS":
            # Return an empty 200 response immediately for preflights
            resp = make_response("", 200)
            return resp

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

    # Ensure tables exist when starting with SQLite
    with app.app_context():
        db.create_all()

    return app

