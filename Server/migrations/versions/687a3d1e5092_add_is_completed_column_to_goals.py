"""Add is_completed column to goals

Revision ID: 687a3d1e5092
Revises: be7540ed5547
Create Date: 2025-08-28 10:38:09.807141

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '687a3d1e5092'
down_revision = 'be7540ed5547'
branch_labels = None
depends_on = None


def upgrade():
    # 1) Add the column as nullable with a server_default of 0 so SQLite can set a value for existing rows
    with op.batch_alter_table('goals', schema=None) as batch_op:
        batch_op.add_column(
            sa.Column('is_completed', sa.Boolean(), nullable=True, server_default=sa.text('0'))
        )

    # 2) Ensure no existing row remains NULL (defensive)
    bind = op.get_bind()
    bind.execute(sa.text("UPDATE goals SET is_completed = 0 WHERE is_completed IS NULL"))

    # 3) Alter the column to be NOT NULL and remove the server_default
    with op.batch_alter_table('goals', schema=None) as batch_op:
        batch_op.alter_column(
            'is_completed',
            existing_type=sa.Boolean(),
            nullable=False,
            server_default=None
        )


def downgrade():
    with op.batch_alter_table('goals', schema=None) as batch_op:
        batch_op.drop_column('is_completed')
