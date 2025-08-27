# app/utils/badge_utils.py
from datetime import datetime, timedelta
from app.extensions import db
from app.models import Badge, UserBadge, GoalProgress, Goal, Cheer

def award_badge(user, badge_name):
    badge = Badge.query.filter_by(name=badge_name).first()
    if not badge:
        return
    # Check if user already has the badge
    existing = UserBadge.query.filter_by(user_id=user.id, badge_id=badge.id).first()
    if not existing:
        db.session.add(UserBadge(user_id=user.id, badge_id=badge.id))
        db.session.commit()

def check_and_award_badges(user):
    # 1. 7-Day Streak
    last_7_days = [(datetime.utcnow().date() - timedelta(days=i)) for i in range(7)]
    progress_dates = (
        db.session.query(GoalProgress.date)
        .join(Goal)
        .filter(Goal.user_id == user.id)
        .distinct()
        .all()
    )
    logged_days = {p.date for p in progress_dates}
    if all(day in logged_days for day in last_7_days):
        award_badge(user, "7-Day Streak")

    # 2. Cheer Giver (5 cheers)
    cheer_count = Cheer.query.filter_by(user_id=user.id).count()
    if cheer_count >= 5:
        award_badge(user, "Cheer Giver")

    # 3. Goal Master (10 completed goals)
    completed_goals = Goal.query.filter_by(user_id=user.id, is_completed=True).count()
    if completed_goals >= 10:
        award_badge(user, "Goal Master")

    # 4. Early Bird (log before 6 AM)
    today_progress = GoalProgress.query.join(Goal).filter(
        Goal.user_id == user.id,
        GoalProgress.date == datetime.utcnow().date()
    ).first()
    if today_progress and datetime.utcnow().hour < 6:
        award_badge(user, "Early Bird")
