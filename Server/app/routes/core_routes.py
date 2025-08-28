# Flask RESTful API resources for GoalForge core models

from flask_restful import Resource, reqparse
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request
from flask import request, current_app , make_response, url_for
from werkzeug.utils import secure_filename
import os
import uuid

from app.models import (
    User, Goal, GoalProgress, Comment, Cheer,
    Badge, UserBadge, Follower, Notification
)
from app.resources.serializers import (
    UserSchema, GoalSchema, GoalProgressSchema,
    CommentSchema, CheerSchema, BadgeSchema,
    UserBadgeSchema, FollowerSchema, NotificationSchema,
    goal_schema, goals_schema, progress_schema, progresses_schema
)
from app.extensions import db
from datetime import datetime , date

# Initialize Marshmallow schemas for serialization
goal_schema = GoalSchema()                   # Single goal
goals_schema = GoalSchema(many=True)         # Multiple goals
progress_schema = GoalProgressSchema(many=True)
progress_single_schema = GoalProgressSchema()
user_schema = UserSchema()                   # Single user
users_schema = UserSchema(many=True)         # Multiple users
comment_schema = CommentSchema()             # Single comment
comments_schema = CommentSchema(many=True)   # Multiple comments
cheer_schema = CheerSchema()                 # Single cheer
cheers_schema = CheerSchema(many=True)       # Multiple cheers
badge_schema = BadgeSchema()                 # Single badge
badges_schema = BadgeSchema(many=True)       # Multiple badges
user_badge_schema = UserBadgeSchema()        # Single user badge
user_badges_schema = UserBadgeSchema(many=True) # Multiple user badges
follower_schema = FollowerSchema()           # Single follower
followers_schema = FollowerSchema(many=True) # Multiple followers
notification_schema = NotificationSchema()   # Single notification
notifications_schema = NotificationSchema(many=True) # Multiple notifications

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif", "webp"}

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


# ------------------- User Resources -------------------

class UserListResource(Resource):
    """Resource for listing all users."""
    def get(self):
        users = User.query.all()
        return users_schema.dump(users), 200

# ------------------- Goal Resources -------------------

class GoalListResource(Resource):
    """Resource for listing and creating goals."""
    def get(self):
        # Attempt to read current user if a JWT is present; allow anonymous access
        try:
            verify_jwt_in_request(optional=True)
            current_user_id = get_jwt_identity()
        except Exception:
            current_user_id = None

        goals = Goal.query.all()

        out = []
        for goal in goals:
            g = goal_schema.dump(goal)

            # collect all progress IDs for this goal (empty list if none)
            progress_ids = [p.id for p in getattr(goal, "progress_logs", [])] or []

        # compute aggregate cheers_count across all progress records for the goal
            cheers_count = 0
            my_cheer_id = None
            if progress_ids:
                cheers_count = Cheer.query.filter(Cheer.goal_progress_id.in_(progress_ids)).count()
            if current_user_id:
                my_cheer = Cheer.query.filter(Cheer.goal_progress_id.in_(progress_ids),
                                             Cheer.user_id == current_user_id).first()
                my_cheer_id = my_cheer.id if my_cheer else None

            g['cheers_count'] = cheers_count
            g['my_cheer_id'] = my_cheer_id
            out.append(g)

        return out, 200

    @jwt_required()
    def post(self):
        """
        Accepts multipart/form-data or application/json.
        If an 'image' file is present, saves it to UPLOAD_FOLDER and sets image_url.
        """
        user_id = get_jwt_identity()

        # If Content-Type is multipart/form-data, fields will be in request.form and files in request.files.
        if request.content_type and request.content_type.startswith("multipart/form-data"):
            data = request.form
        else:
            data = request.get_json() or {}

        title = data.get("title")
        if not title:
            return {"message": "title is required"}, 400

        # parse dates if present
        def parse_date(s):
            if not s:
                return None
            try:
                return datetime.strptime(s, "%Y-%m-%d").date()
            except Exception:
                return None

        start_date = parse_date(data.get("start_date"))
        end_date = parse_date(data.get("end_date"))

        # handle image file
        image_url = None
        upload_folder = current_app.config.get("UPLOAD_FOLDER") or os.path.join(current_app.static_folder or "static", "uploads")
        os.makedirs(upload_folder, exist_ok=True)

        file = request.files.get("image")
        if file and file.filename:
            if not allowed_file(file.filename):
                return {"message": "Unsupported image type"}, 400
            # generate safe unique filename
            filename = secure_filename(file.filename)
            filename = f"{uuid.uuid4().hex}_{filename}"
            save_path = os.path.join(upload_folder, filename)
            file.save(save_path)
            # construct public URL to static/uploads/<filename>
            # assumes upload_folder is <app.static_folder>/uploads
            # Use url_for to build absolute path
            try:
                # path relative to static folder
                rel_path = os.path.relpath(save_path, current_app.static_folder)
                image_url = url_for("static", filename=rel_path.replace("\\", "/"), _external=True)
            except Exception:
                # fallback: build from request.host_url
                image_url = f"{request.host_url.rstrip('/')}/static/uploads/{filename}"

        goal = Goal(
            user_id=user_id,
            title=title,
            description=data.get("description"),
            category=data.get("category") or "General",
            start_date=start_date or datetime.utcnow().date(),
            end_date=end_date,
            frequency=(data.get("frequency") or "daily").lower(),
            is_public=(data.get("is_public") in [True, "true", "1", "True"]),
            image_url=image_url
        )

        db.session.add(goal)
        db.session.commit()
        return goal_schema.dump(goal), 201


class GoalResource(Resource):
    """Resource for retrieving, updating, or deleting a single goal."""
    def get(self, goal_id):
        # Attempt to read current user if token present (allow anonymous GET)
        try:
            verify_jwt_in_request(optional=True)
            current_user_id = get_jwt_identity()
        except Exception:
            current_user_id = None

        goal = Goal.query.get_or_404(goal_id)
        g = goal_schema.dump(goal)

        progress_ids = [p.id for p in getattr(goal, "progress_logs", [])] or []

        cheers_count = 0
        my_cheer_id = None
        if progress_ids:
            cheers_count = Cheer.query.filter(Cheer.goal_progress_id.in_(progress_ids)).count()
        if current_user_id:
            my_cheer = Cheer.query.filter(Cheer.goal_progress_id.in_(progress_ids),
                                         Cheer.user_id == current_user_id).first()
            my_cheer_id = my_cheer.id if my_cheer else None

        g['cheers_count'] = cheers_count
        g['my_cheer_id'] = my_cheer_id

        return g, 200

    @jwt_required()
    def patch(self, goal_id):
        goal = Goal.query.get_or_404(goal_id)
        data = {}

    # If multipart/form-data, use request.form ; otherwise JSON
        if request.content_type and request.content_type.startswith("multipart/form-data"):
            data = request.form.to_dict()
        else:
            data = request.get_json() or {}

    # parse date helper (same as before)
        def parse_date_if_present(key):
            val = data.get(key, None)
            if val in (None, ""):
                return None if val is None else None
            try:
                return datetime.strptime(val, "%Y-%m-%d").date()
            except Exception:
                return None

    # Update standard fields
        if "title" in data:
            goal.title = data.get("title")
        if "description" in data:
            goal.description = data.get("description")
        if "category" in data:
            goal.category = data.get("category")
        if "frequency" in data:
            goal.frequency = data.get("frequency")
        if "is_public" in data:
            goal.is_public = str(data.get("is_public")).lower() in ("true", "1", "t", "yes")

        if "start_date" in data:
            parsed = parse_date_if_present("start_date")
            if parsed is not None:
                goal.start_date = parsed
        if "end_date" in data:
            parsed = parse_date_if_present("end_date")
        # allow explicitly setting end_date to null/empty to remove it
            goal.end_date = parsed

    # ----- Image handling -----
        upload_folder = current_app.config.get("UPLOAD_FOLDER")
        allowed = current_app.config.get("ALLOWED_IMAGE_EXTENSIONS", {"png","jpg","jpeg","gif","webp"})

    # 1) If remove_image flag is present and truthy -> delete current image and clear URL
        remove_image_flag = data.get("remove_image") or request.form.get("remove_image") if request.form else None
        if remove_image_flag and str(remove_image_flag) not in ("", "0", "false", "False"):
        # attempt to remove local file (if it exists and sits in our static/uploads dir)
            try:
                if goal.image_url:
                # derive local path from url by removing host + /static/
                    static_folder = current_app.static_folder
                # assume image_url is like https://host/static/uploads/filename
                    rel = None
                    if goal.image_url and "/static/" in goal.image_url:
                        rel = goal.image_url.split("/static/")[-1]
                    if rel:
                        path = os.path.join(static_folder, rel)
                        if os.path.exists(path):
                            os.remove(path)
            except Exception:
                current_app.logger.exception("Failed to delete old goal image")
            goal.image_url = None

    # 2) If an image file provided in request.files -> save and set image_url
        file = request.files.get("image")
        if file and file.filename:
        # basic extension check
            ext = file.filename.rsplit(".", 1)[-1].lower()
            if ext not in allowed:
                return {"message": "Unsupported image type"}, 400

        # remove previous local image (optional)
            try:
                if goal.image_url and "/static/" in goal.image_url:
                    rel = goal.image_url.split("/static/")[-1]
                    old_path = os.path.join(current_app.static_folder, rel)
                    if os.path.exists(old_path):
                        os.remove(old_path)
            except Exception:
                current_app.logger.exception("Failed to delete old goal image before saving new one")

        # save new file with safe, unique name
            filename = secure_filename(file.filename)
            filename = f"{uuid.uuid4().hex}_{filename}"
            dest = os.path.join(upload_folder, filename)
            os.makedirs(upload_folder, exist_ok=True)
            file.save(dest)
        # build url
            try:
                rel_path = os.path.relpath(dest, current_app.static_folder)
                goal.image_url = url_for("static", filename=rel_path.replace("\\", "/"), _external=True)
            except Exception:
                goal.image_url = f"{request.host_url.rstrip('/')}/static/uploads/{filename}"

        db.session.commit()
        return goal_schema.dump(goal), 200


    @jwt_required()
    def delete(self, goal_id):
        # load goal and current user
        current_user = User.query.get(get_jwt_identity())
        goal = Goal.query.get_or_404(goal_id)

        # Authorization: owner or admin (level 99)
        if not current_user or (goal.user_id != current_user.id and current_user.level != 99):
            return {"message": "Not authorized to delete this goal."}, 403

        try:
            # Bulk-delete pattern: delete children first to avoid FK/NULL updates

            # 1) fetch goal progress ids (use a query to avoid loading full objects)
            progress_id_rows = db.session.query(GoalProgress.id).filter(GoalProgress.goal_id == goal.id).all()
            progress_ids = [pid for (pid,) in progress_id_rows]  # unpack tuples

            if progress_ids:
                # 2) delete cheers and comments that reference those progress rows
                Cheer.query.filter(Cheer.goal_progress_id.in_(progress_ids)).delete(synchronize_session=False)
                Comment.query.filter(Comment.goal_progress_id.in_(progress_ids)).delete(synchronize_session=False)

                # 3) delete the goal progress rows themselves
                GoalProgress.query.filter(GoalProgress.goal_id == goal.id).delete(synchronize_session=False)

            # 4) delete followers of the goal (if you track followed_goal_id)
            Follower.query.filter(Follower.followed_goal_id == goal.id).delete(synchronize_session=False)

            # 5) any other related cleanup (notifications referencing the goal/progress) - add if needed

            # 6) finally delete the goal
            db.session.delete(goal)
            db.session.commit()
            return {"message": "Goal and related data deleted successfully."}, 200

        except Exception as exc:
            db.session.rollback()
            current_app.logger.exception("Error deleting goal %s: %s", goal_id, exc)
            return {"message": "Failed to delete goal."}, 500

    
# ------------------- Goal Progress Resources -------------------

class GoalProgressListResource(Resource):
    """Resource for listing and creating progress logs."""
    def get(self):
        progress_logs = GoalProgress.query.all()
        return progresses_schema.dump(progress_logs), 200

    @jwt_required()
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('goal_id', type=int, required=True)
        parser.add_argument('date', required=True)
        parser.add_argument('note')
        parser.add_argument('media_url')
        parser.add_argument('xp_earned', type=int, default=10)
        args = parser.parse_args()

        date_obj = datetime.strptime(args['date'], "%Y-%m-%d").date()

        progress = GoalProgress(
            goal_id=args['goal_id'],
            date=date_obj,
            note=args['note'],
            media_url=args['media_url'],
            xp_earned=args['xp_earned']
        )

        db.session.add(progress)
        db.session.commit()

        # Recompute streaks for the parent goal
        goal = Goal.query.get(progress.goal_id)
        if goal:
            db.session.refresh(goal)
            cur_streak, longest = compute_streaks_for_goal(goal)
            goal.streak_count = cur_streak
            goal.longest_streak = max(goal.longest_streak or 0, longest)
            db.session.commit()

            # --- BADGE LOGIC ---
            user_id = goal.user_id if hasattr(goal, 'user_id') else None
            if user_id:
                self.check_and_award_badges_for_progress(user_id, goal, date_obj)

        return {
            "progress": progress_single_schema.dump(progress),
            "goal": goal_schema.dump(goal) if goal else None
        }, 201

    def check_and_award_badges_for_progress(self, user_id, goal, date_obj):
        """Check and award badges related to logging progress."""
        # 1) Early Bird badge: logging before 6 AM
        if datetime.now().hour < 6:
            early_bird_badge = Badge.query.filter_by(name="Early Bird").first()
            if early_bird_badge and not UserBadge.query.filter_by(user_id=user_id, badge_id=early_bird_badge.id).first():
                db.session.add(UserBadge(user_id=user_id, badge_id=early_bird_badge.id))
                db.session.commit()

        # 2) 7-Day Streak badge
        if goal.streak_count >= 7:
            streak_badge = Badge.query.filter_by(name="7-Day Streak").first()
            if streak_badge and not UserBadge.query.filter_by(user_id=user_id, badge_id=streak_badge.id).first():
                db.session.add(UserBadge(user_id=user_id, badge_id=streak_badge.id))
                db.session.commit()

        # 3) Goal Master badge: check if user completed 10 goals
        completed_goals = Goal.query.filter_by(user_id=user_id, is_completed=True).count()
        if completed_goals >= 10:
            goal_master_badge = Badge.query.filter_by(name="Goal Master").first()
            if goal_master_badge and not UserBadge.query.filter_by(user_id=user_id, badge_id=goal_master_badge.id).first():
                db.session.add(UserBadge(user_id=user_id, badge_id=goal_master_badge.id))
                db.session.commit()



class GoalProgressResource(Resource):
    """Resource for retrieving, updating, or deleting a single progress log."""
    def get(self, progress_id):
        progress = GoalProgress.query.get_or_404(progress_id)
        return progress_single_schema.dump(progress), 200

    @jwt_required()
    def put(self, progress_id):
        progress = GoalProgress.query.get_or_404(progress_id)
        parser = reqparse.RequestParser()
        parser.add_argument('date')
        parser.add_argument('note')
        parser.add_argument('media_url')
        parser.add_argument('xp_earned', type=int)
        args = parser.parse_args()

        # Update only provided fields
        for attr, value in args.items():
            if value is not None:
                setattr(progress, attr, value)

        db.session.commit()
        return progress_single_schema.dump(progress), 200

    @jwt_required()
    def delete(self, progress_id):
        progress = GoalProgress.query.get_or_404(progress_id)
        goal_id = progress.goal_id


        # Delete related cheers
        Cheer.query.filter_by(goal_progress_id=progress.id).delete()
        # Delete related comments
        Comment.query.filter_by(goal_progress_id=progress.id).delete()
        # Delete the progress log itself
        db.session.delete(progress)
        db.session.commit()

 # recompute streaks for parent goal
        goal = Goal.query.get(goal_id)
        if goal:
            cur_streak, longest = compute_streaks_for_goal(goal)
            goal.streak_count = cur_streak
            # longest_streak may need recomputation (not just max) — set to longest
            goal.longest_streak = max(goal.longest_streak or 0, longest)
            db.session.commit()

        return {"message": "Progress log and related data deleted successfully."}, 200
# ------------------- Other List Resources -------------------


class CommentListResource(Resource):
    """Resource for listing and creating comments."""
    def get(self):
        # support query params: goal_progress_id or goal_id
        gp_id = request.args.get("goal_progress_id", type=int)
        goal_id = request.args.get("goal_id", type=int)

        query = Comment.query
        if gp_id:
            query = query.filter_by(goal_progress_id=gp_id)
        elif goal_id:
            # get comments for any progress rows that belong to this goal
            query = query.join(GoalProgress, Comment.goal_progress_id == GoalProgress.id).filter(GoalProgress.goal_id == goal_id)

        comments = query.order_by(Comment.created_at.asc()).all()
        return comments_schema.dump(comments), 200

    @jwt_required()
    def post(self):
        # Accept either goal_progress_id or goal_id. Content required.
        data = request.get_json() or {}
        content = (data.get("content") or "").strip()
        gp_id = data.get("goal_progress_id")
        goal_id = data.get("goal_id")

        if not content:
            return {"message": "content is required"}, 400

        # If no gp_id supplied, create a minimal GoalProgress for the provided goal_id
        if not gp_id:
            if not goal_id:
                return {"message": "goal_progress_id or goal_id is required"}, 400

            goal = Goal.query.get(goal_id)
            if not goal:
                return {"message": "Goal not found"}, 404

            # create a minimal GoalProgress. GoalProgress requires 'date', so use today.
            gp = GoalProgress(
                goal_id=goal.id,
                date=date.today(),          # required field
                note="Auto-created progress for comment",
                xp_earned=10
            )
            db.session.add(gp)
            db.session.commit()
            gp_id = gp.id

        # Determine user_id from JWT identity (server trusts JWT)
        identity = get_jwt_identity()
        # Adapt this if your identity payload is different (e.g. a dict)
        if isinstance(identity, int):
            user_id = identity
        elif isinstance(identity, dict):
            user_id = identity.get("id")
        else:
            # try to coerce
            user_id = identity

        if not user_id:
            return {"message": "Invalid user identity"}, 401

        # Create the comment
        comment = Comment(
            user_id=user_id,
            goal_progress_id=gp_id,
            content=content,
            created_at=datetime.utcnow()
        )
        db.session.add(comment)
        db.session.commit()

        # Return the created comment (including goal_progress_id)
        return comment_schema.dump(comment), 201


class CommentResource(Resource):
    """Resource for retrieving, updating, or deleting a single comment."""
    def get(self, comment_id):
        comment = Comment.query.get_or_404(comment_id)
        return comment_schema.dump(comment), 200

    @jwt_required()
    def put(self, comment_id):
        comment = Comment.query.get_or_404(comment_id)
        parser = reqparse.RequestParser()
        parser.add_argument('content')
        args = parser.parse_args()

        if args.get('content') is not None:
            comment.content = args['content']

        db.session.commit()
        return comment_schema.dump(comment), 200

    @jwt_required()
    def delete(self, comment_id):
        comment = Comment.query.get_or_404(comment_id)
        db.session.delete(comment)
        db.session.commit()
        return {"message": "Comment deleted"}, 200

class CheerListResource(Resource):
    def get(self):
        gp_id = request.args.get("goal_progress_id", type=int)
        goal_id = request.args.get("goal_id", type=int)

        query = Cheer.query
        if gp_id:
            query = query.filter_by(goal_progress_id=gp_id)
        elif goal_id:
            query = query.join(GoalProgress, Cheer.goal_progress_id == GoalProgress.id).filter(GoalProgress.goal_id == goal_id)

        cheers = query.order_by(Cheer.created_at.asc()).all()
        return cheers_schema.dump(cheers), 200

    @jwt_required()
    def post(self):
        data = request.get_json() or {}
        gp_id = data.get("goal_progress_id")
        goal_id = data.get("goal_id")

        if not gp_id and not goal_id:
            return {"message": "goal_progress_id or goal_id is required"}, 400

        # If only goal_id is provided, auto-create a GoalProgress record
        if not gp_id:
            goal = Goal.query.get(goal_id)
            if not goal:
                return {"message": "Goal not found"}, 404
            gp = GoalProgress(goal_id=goal.id, date=date.today(), note="Auto-created for cheer", xp_earned=0)
            db.session.add(gp)
            db.session.commit()
            gp_id = gp.id

        # --- FIX for identity type issue ---
        identity = get_jwt_identity()
        if isinstance(identity, dict):
            user_id = identity.get("id")
        else:
            try:
                user_id = int(identity)
            except (ValueError, TypeError):
                return {"message": "Invalid user identity"}, 401

        if not user_id:
            return {"message": "Invalid user identity"}, 401

        # Check if user has already cheered this GoalProgress
        existing = Cheer.query.filter_by(user_id=user_id, goal_progress_id=gp_id).first()
        if existing:
            cheer_obj = cheer_schema.dump(existing)
            cheer_count = Cheer.query.filter_by(goal_progress_id=gp_id).count()
            cheer_obj.update({"goal_progress_id": gp_id, "cheer_count": cheer_count})
            return cheer_obj, 200

        # Create a new cheer
        cheer = Cheer(user_id=user_id, goal_progress_id=gp_id, created_at=datetime.utcnow())
        db.session.add(cheer)
        db.session.commit()

        # --- BADGE LOGIC for "Cheer Giver" ---
        cheer_count_by_user = Cheer.query.filter_by(user_id=user_id).count()
        cheer_badge = Badge.query.filter_by(name="Cheer Giver").first()
        if cheer_badge and cheer_count_by_user >= 4 and not UserBadge.query.filter_by(user_id=user_id, badge_id=cheer_badge.id).first():
            db.session.add(UserBadge(user_id=user_id, badge_id=cheer_badge.id))
            db.session.commit()

        cheer_count = Cheer.query.filter_by(goal_progress_id=gp_id).count()
        response = cheer_schema.dump(cheer)
        response.update({"goal_progress_id": gp_id, "cheer_count": cheer_count})
        return response, 201



class CheerResource(Resource):
    """Resource for retrieving, updating, or deleting a single cheer."""
    def get(self, cheer_id):
        cheer = Cheer.query.get_or_404(cheer_id)
        return cheer_schema.dump(cheer), 200
    
    @jwt_required()
    def put(self, cheer_id):
        cheer = Cheer.query.get_or_404(cheer_id)
        parser = reqparse.RequestParser()
        parser.add_argument('user_id', type=int)
        parser.add_argument('goal_progress_id', type=int)
        args = parser.parse_args()

        # Update only provided fields
        for attr, value in args.items():
            if value is not None:
                setattr(cheer, attr, value)

        db.session.commit()
        return cheer_schema.dump(cheer), 200

    @jwt_required()
    def delete(self, cheer_id):
        cheer = Cheer.query.get_or_404(cheer_id)
        db.session.delete(cheer)
        db.session.commit()
        return {"message": "Cheer deleted"}, 200

class BadgeListResource(Resource):
    """Resource for listing all badges."""
    def get(self):
        badges = Badge.query.all()
        return badges_schema.dump(badges), 200
    
    @jwt_required()
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('name', required=True)
        parser.add_argument('description', required=True)
        args = parser.parse_args()

        badge = Badge(
            name=args['name'],
            description=args['description']
        )
        db.session.add(badge)
        db.session.commit()
        return badge_schema.dump(badge), 201

class BadgeResource(Resource):
    """Resource for retrieving, updating, or deleting a single badge."""
    def get(self, badge_id):
        badge = Badge.query.get_or_404(badge_id)
        return badge_schema.dump(badge), 200
    @jwt_required()
    def put(self, badge_id):
        badge = Badge.query.get_or_404(badge_id)
        parser = reqparse.RequestParser()
        parser.add_argument('name')
        parser.add_argument('description')
        args = parser.parse_args()

        # Update only provided fields
        for attr, value in args.items():
            if value is not None:
                setattr(badge, attr, value)

        db.session.commit()
        return badge_schema.dump(badge), 200

    @jwt_required()
    def delete(self, badge_id):
        badge = Badge.query.get_or_404(badge_id)
        db.session.delete(badge)
        db.session.commit()
        return {"message": "Badge deleted"}, 200

class UserBadgeListResource(Resource):
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('user_id', type=int, required=False, location='args')
        args = parser.parse_args()

        if args.get('user_id'):
            user_id = args['user_id']
            user_badges = UserBadge.query.filter_by(user_id=user_id).order_by(UserBadge.awarded_at.desc()).all()

            # If user has no badges, assign the default badge dynamically
            if not user_badges:
                # Check if the default badge exists
                default_badge = Badge.query.filter_by(name="Welcome Aboard").first()
                if not default_badge:
                    default_badge = Badge(name="Welcome Aboard", description="Created an account")
                    db.session.add(default_badge)
                    db.session.commit()

                # Assign default badge to user
                new_user_badge = UserBadge(user_id=user_id, badge_id=default_badge.id)
                db.session.add(new_user_badge)
                db.session.commit()

                # Re-fetch badges so that we include the newly added badge
                user_badges = [new_user_badge]
        else:
            user_badges = UserBadge.query.order_by(UserBadge.awarded_at.desc()).all()

        return user_badges_schema.dump(user_badges), 200



    @jwt_required()
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('user_id', type=int, required=True)
        parser.add_argument('badge_id', type=int, required=True)
        args = parser.parse_args()

        user_badge = UserBadge(
            user_id=args['user_id'],
            badge_id=args['badge_id']
        )
        db.session.add(user_badge)
        db.session.commit()
        return user_badge_schema.dump(user_badge), 201

    @jwt_required()
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('user_id', type=int, required=True)
        parser.add_argument('badge_id', type=int, required=True)
        args = parser.parse_args()

        user_badge = UserBadge(
            user_id=args['user_id'],
            badge_id=args['badge_id']
        )
        db.session.add(user_badge)
        db.session.commit()
        return user_badge_schema.dump(user_badge), 201
    
class UserBadgeResource(Resource):
    """Resource for retrieving, updating, or deleting a single user badge."""
    def get(self, user_badge_id):
        user_badge = UserBadge.query.get_or_404(user_badge_id)
        return user_badge_schema.dump(user_badge), 200
    
    @jwt_required()
    def put(self, user_badge_id):
        user_badge = UserBadge.query.get_or_404(user_badge_id)
        parser = reqparse.RequestParser()
        parser.add_argument('user_id', type=int)
        parser.add_argument('badge_id', type=int)
        args = parser.parse_args()

        # Update only provided fields
        for attr, value in args.items():
            if value is not None:
                setattr(user_badge, attr, value)

        db.session.commit()
        return user_badge_schema.dump(user_badge), 200

    @jwt_required()
    def delete(self, user_badge_id):
        user_badge = UserBadge.query.get_or_404(user_badge_id)
        db.session.delete(user_badge)
        db.session.commit()
        return {"message": "User badge deleted"}, 200
class UserBadgesByUserResource(Resource):
    def get(self, user_id):
        user_badges = UserBadge.query.filter_by(user_id=user_id).order_by(UserBadge.awarded_at.desc()).all()
        return user_badges_schema.dump(user_badges), 200

def _iso(dt):
    if not dt: 
        return None
    if isinstance(dt, str):
        return dt
    return dt.isoformat()

class UserActivityResource(Resource):
    # optional: allow preflight explicitly (not required if flask-cors is configured)
    def options(self, user_id):
        resp = make_response("", 200)
        return resp

    # If you want this endpoint to require auth, uncomment @jwt_required()
    # @jwt_required()
    def get(self, user_id):
        events = []

        # 1) badge awards
        try:
            user_badges = UserBadge.query.filter_by(user_id=user_id).order_by(UserBadge.awarded_at.desc()).all()
            for ub in user_badges:
                badge = getattr(ub, "badge", None)
                events.append({
                    "type": "badge_awarded",
                    "timestamp": _iso(getattr(ub, "awarded_at", None)),
                    "payload": {
                        "user_badge_id": ub.id,
                        "badge_id": ub.badge_id,
                        "badge": {
                            "id": badge.id if badge else ub.badge_id,
                            "name": badge.name if badge else None,
                            "description": badge.description if badge else None,
                            "icon_url": badge.icon_url if badge else None
                        }
                    }
                })
        except Exception:
            # ignore if model not present or error
            pass

        # 2) goals (created/completed) - adapt fields to your Goal model
        try:
            goals = Goal.query.filter_by(user_id=user_id).all()
            for g in goals:
                created_at = getattr(g, "created_at", None)
                completed_at = getattr(g, "completed_at", None) or getattr(g, "completed_on", None)

                if created_at:
                    events.append({
                        "type": "goal_created",
                        "timestamp": _iso(created_at),
                        "payload": {"goal_id": g.id, "title": getattr(g, "title", None)}
                    })
                if completed_at:
                    events.append({
                        "type": "goal_completed",
                        "timestamp": _iso(completed_at),
                        "payload": {"goal_id": g.id, "title": getattr(g, "title", None)}
                    })
        except Exception:
            pass

        # 3) follower events (someone followed this user's goal) - adapt to your follower model
        try:
            # If your Follower model stores followed_goal_id -> we need to join to goal owner
            followers = Follower.query.all()
            for f in followers:
                # If your model contains followed_goal_id -> find goal and check owner
                fg = getattr(f, "followed_goal_id", None)
                if fg:
                    goal = Goal.query.get(fg)
                    if goal and getattr(goal, "user_id", None) == user_id:
                        events.append({
                            "type": "follow",
                            "timestamp": _iso(getattr(f, "followed_at", None) or getattr(f, "created_at", None)),
                            "payload": {"follower_id": getattr(f, "follower_id", None), "followed_goal_id": fg}
                        })
                else:
                    # alternative follower model shape: if follower has a 'followee_user_id' etc
                    if getattr(f, "followee_user_id", None) == user_id:
                        events.append({
                            "type": "follow",
                            "timestamp": _iso(getattr(f, "created_at", None)),
                            "payload": {"follower_id": getattr(f, "follower_id", None)}
                        })
        except Exception:
            pass

        # combine & sort by timestamp (descending)
        events = [e for e in events if e.get("timestamp")]
        events.sort(key=lambda x: x["timestamp"], reverse=True)

        # limit to 100 events to avoid huge payloads
        return events[:100], 200
class FollowerListResource(Resource):
    """Resource for listing all followers."""
    def get(self):
        followers = Follower.query.all()
        return followers_schema.dump(followers), 200
    
    @jwt_required()
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('follower_id', type=int, required=True)
        parser.add_argument('followed_goal_id', type=int, required=True)  # match model
        args = parser.parse_args()

        follower = Follower(
        follower_id=args['follower_id'],
        followed_goal_id=args['followed_goal_id']
        )
        db.session.add(follower)
        db.session.commit()
        return follower_schema.dump(follower), 201


class FollowerResource(Resource):
    """Resource for retrieving, updating, or deleting a single follower."""
    def get(self, follower_id):
        follower = Follower.query.get_or_404(follower_id)
        return follower_schema.dump(follower), 200
    
    @jwt_required()
    def put(self, follower_id):
        follower = Follower.query.get_or_404(follower_id)
        parser = reqparse.RequestParser()
        parser.add_argument('follower_id', type=int)
        parser.add_argument('followed_id', type=int)
        args = parser.parse_args()

        # Update only provided fields
        for attr, value in args.items():
            if value is not None:
                setattr(follower, attr, value)

        db.session.commit()
        return follower_schema.dump(follower), 200

    @jwt_required()
    def delete(self, follower_id):
        follower = Follower.query.get_or_404(follower_id)
        db.session.delete(follower)
        db.session.commit()
        return {"message": "Follower deleted"}, 200

class NotificationListResource(Resource):
    """Resource for listing all notifications."""
    def get(self):
        notifications = Notification.query.all()
        return notifications_schema.dump(notifications), 200
    
    @jwt_required()
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('user_id', type=int, required=True)
        parser.add_argument('type', type=str, required=True)
        parser.add_argument('reference_id', type=int)
        args = parser.parse_args()

        notification = Notification(
            user_id=args['user_id'],
            type=args['type'],
            reference_id=args['reference_id']
        )
        db.session.add(notification)
        db.session.commit()
        return notification_schema.dump(notification), 201

class NotificationResource(Resource):
    """Resource for retrieving, updating, or deleting a single notification."""
    def get(self, notification_id):
        notification = Notification.query.get_or_404(notification_id)
        return notification_schema.dump(notification), 200
    
    @jwt_required()
    def put(self, notification_id):
        notification = Notification.query.get_or_404(notification_id)
        parser = reqparse.RequestParser()
        parser.add_argument('user_id', type=int)
        parser.add_argument('type', type=str)
        parser.add_argument('reference_id', type=int)
        parser.add_argument('is_read', type=lambda x: str(x).lower() == 'true')
        args = parser.parse_args()

        # Update only provided fields
        for attr, value in args.items():
            if value is not None:
                setattr(notification, attr, value)

        db.session.commit()
        return notification_schema.dump(notification), 200
    
    @jwt_required()
    def delete(self, notification_id):
        notification = Notification.query.get_or_404(notification_id)
        db.session.delete(notification)
        db.session.commit()
        return {"message": "Notification deleted"}, 200
    
from datetime import date, timedelta
from collections import defaultdict

def _dates_from_progress(progress_list):
    # accept progress_list of GoalProgress objects or dicts with 'date' field
    s = set()
    for p in progress_list:
        d = None
        if hasattr(p, 'date'):
            d = p.date
        else:
            d = p.get('date')
            # if string, parse
            if isinstance(d, str):
                d = datetime.strptime(d[:10], "%Y-%m-%d").date()
        if d:
            s.add(d)
    return sorted(s)

def compute_daily_streaks(dates_sorted):
    """Given sorted unique date objects, return (current_streak, longest_streak).
       current_streak counts up to today (inclusive if there's a log today)."""
    if not dates_sorted:
        return 0, 0

    today = date.today()
    longest = 0
    current = 0

    # compute longest streak
    temp = 1
    for i in range(1, len(dates_sorted)):
        if (dates_sorted[i] - dates_sorted[i-1]).days == 1:
            temp += 1
        else:
            if temp > longest:
                longest = temp
            temp = 1
    if temp > longest:
        longest = temp

    # compute current streak (walk backward from the most recent date)
    last = dates_sorted[-1]
    if last > today:
        # future-dated entries possible; ignore those beyond today for current streak
        # filter to <= today
        dates_sorted = [d for d in dates_sorted if d <= today]
        if not dates_sorted:
            return 0, longest
        last = dates_sorted[-1]

    # now count consecutive days backward from last while days difference == 1
    cur = 1
    i = len(dates_sorted) - 1
    while i > 0:
        if (dates_sorted[i] - dates_sorted[i-1]).days == 1:
            cur += 1
            i -= 1
        else:
            break

    # If the most recent log is not today or yesterday, current streak may be 1
    # but should only count up to today if last is today. We treat current streak as consecutive
    # days ending at the last logged date (common approach).
    return cur, longest

def compute_weekly_streaks(dates_sorted):
    # Convert to ISO week numbers and compute consecutive week streaks.
    if not dates_sorted:
        return 0, 0
    weeks = sorted({(d.isocalendar()[0], d.isocalendar()[1]) for d in dates_sorted})
    # weeks is set of (year, week)
    weeks_sorted = sorted(weeks)
    longest = 0
    temp = 1
    for i in range(1, len(weeks_sorted)):
        y1, w1 = weeks_sorted[i-1]
        y2, w2 = weeks_sorted[i]
        # compute if consecutive by week number
        prev = date.fromisocalendar(y1, w1, 1)
        curr = date.fromisocalendar(y2, w2, 1)
        if (curr - prev).days <= 7:  # next calendar week
            temp += 1
        else:
            longest = max(longest, temp)
            temp = 1
    longest = max(longest, temp)

    # current streak: count consecutive weeks up to last logged week
    cur = 1
    i = len(weeks_sorted) - 1
    while i > 0:
        y1, w1 = weeks_sorted[i-1]
        y2, w2 = weeks_sorted[i]
        prev = date.fromisocalendar(y1, w1, 1)
        curr = date.fromisocalendar(y2, w2, 1)
        if (curr - prev).days <= 7:
            cur += 1
            i -= 1
        else:
            break
    return cur, longest

def compute_monthly_streaks(dates_sorted):
    if not dates_sorted:
        return 0, 0
    months = sorted({(d.year, d.month) for d in dates_sorted})
    longest = 0
    temp = 1
    for i in range(1, len(months)):
        y1, m1 = months[i-1]
        y2, m2 = months[i]
        # consecutive months logic
        if (y2 == y1 and m2 == m1 + 1) or (y2 == y1 + 1 and m1 == 12 and m2 == 1):
            temp += 1
        else:
            longest = max(longest, temp)
            temp = 1
    longest = max(longest, temp)

    cur = 1
    i = len(months) - 1
    while i > 0:
        y1, m1 = months[i-1]
        y2, m2 = months[i]
        if (y2 == y1 and m2 == m1 + 1) or (y2 == y1 + 1 and m1 == 12 and m2 == 1):
            cur += 1
            i -= 1
        else:
            break
    return cur, longest

def compute_streaks_for_goal(goal):
    """Given a Goal object, compute (current_streak, longest_streak) based on progress_logs."""
    # gather unique date objects from goal.progress_logs
    progress_list = getattr(goal, "progress_logs", []) or []
    dates_sorted = _dates_from_progress(progress_list)
    if not dates_sorted:
        return 0, 0
    freq = (goal.frequency or "daily").lower()
    if freq.startswith("daily"):
        return compute_daily_streaks(dates_sorted)
    elif freq.startswith("week"):
        return compute_weekly_streaks(dates_sorted)
    elif freq.startswith("month"):
        return compute_monthly_streaks(dates_sorted)
    else:
        # default to daily
        return compute_daily_streaks(dates_sorted)
