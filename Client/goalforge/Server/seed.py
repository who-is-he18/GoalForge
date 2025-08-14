# seed.py

from app import create_app
from app.extensions import db
from app.models import *
from datetime import datetime, timedelta
import random

app = create_app()

with app.app_context():
    # Reset all tables in the database
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
        user.set_password("test1234")  # All test users use this password
        db.session.add(user)
        users.append(user)

    # Admin user
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
    badge1 = Badge(name="7-Day Streak", description="Logged 7 days in a row")
    badge2 = Badge(name="Cheer Giver", description="Gave 5 cheers")
    db.session.add_all([badge1, badge2])
    db.session.commit()

    # --- USER BADGES ---
    db.session.add(UserBadge(user_id=users[0].id, badge_id=badge1.id))
    db.session.add(UserBadge(user_id=users[1].id, badge_id=badge2.id))
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
