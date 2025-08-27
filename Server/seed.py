# seed.py
from app import create_app
from app.extensions import db
from app.models import *
from datetime import datetime, timedelta
import random

app = create_app()

with app.app_context():
    # Reset DB
    db.drop_all()
    db.create_all()

    print("Seeding data...")

    # --- USERS ---
    users = []
    for i in range(3):
        user = User(
            username=f"user{i+1}",
            email=f"user{i+1}@goalforge.com"
        )
        user.set_password("test1234")
        db.session.add(user)
        users.append(user)

    admin = User(
        username="admin",
        email="admin@goalforge.com",
        level=10,
        xp=1000
    )
    admin.set_password("adminpass123")
    db.session.add(admin)
    users.append(admin)

    db.session.commit()

    # --- GOALS ---
    goals = []
    for i in range(3):
        goal = Goal(
            user_id=users[i % 3].id,
            title=f"Goal {i+1}",
            description="This is a sample goal.",
            start_date=datetime.utcnow().date(),
            frequency='daily'
        )
        db.session.add(goal)
        goals.append(goal)
    db.session.commit()

    # --- PROGRESS LOGS ---
    for goal in goals:
        for j in range(3):
            log = GoalProgress(
                goal_id=goal.id,
                date=datetime.utcnow().date() - timedelta(days=j),
                note=f"Update {j+1} for goal {goal.id}",
                xp_earned=random.choice([10, 15, 20])
            )
            db.session.add(log)
    db.session.commit()

    # --- CHEERS ---
    for user in users:
        for progress in GoalProgress.query.all():
            if random.choice([True, False]):
                db.session.add(Cheer(user_id=user.id, goal_progress_id=progress.id))
    db.session.commit()

    # --- COMMENTS ---
    for progress in GoalProgress.query.all():
        db.session.add(Comment(
            user_id=random.choice(users).id,
            goal_progress_id=progress.id,
            content="Nice work!"
        ))
    db.session.commit()

    # --- BADGES ---
    # Ensure default badge exists
    default_badge = Badge.query.filter_by(name="Welcome Aboard").first()
    if not default_badge:
        default_badge = Badge(name="Welcome Aboard", description="Created an account")
        db.session.add(default_badge)
        db.session.commit()

    # Other badges
    badge_streak = Badge(name="7-Day Streak", description="Logged 7 days in a row")
    badge_cheer = Badge(name="Cheer Giver", description="Gave 4 cheers")
    badge_goal_master = Badge(name="Goal Master", description="Completed 10 goals")
    badge_early_bird = Badge(name="Early Bird", description="Logged before 6am")

    db.session.add_all([badge_streak, badge_cheer, badge_goal_master, badge_early_bird])
    db.session.commit()

    # --- USER BADGES ---
    for user in users:
        # Every user gets the default badge
        db.session.add(UserBadge(user_id=user.id, badge_id=default_badge.id))

        # Randomly assign 0–2 additional badges
        extra_badges = random.sample(
            [badge_streak, badge_cheer, badge_goal_master, badge_early_bird],
            k=random.randint(0, 2)
        )
        for extra_badge in extra_badges:
            db.session.add(UserBadge(user_id=user.id, badge_id=extra_badge.id))

    db.session.commit()

    # --- FOLLOWERS ---
    db.session.add(Follower(follower_id=users[0].id, followed_goal_id=goals[1].id))
    db.session.add(Follower(follower_id=users[1].id, followed_goal_id=goals[0].id))
    db.session.commit()

    # --- NOTIFICATIONS ---
    db.session.add(Notification(
        user_id=users[0].id,
        type="new_cheer",
        reference_id=1
    ))
    db.session.commit()

    print("Seeding complete.")
