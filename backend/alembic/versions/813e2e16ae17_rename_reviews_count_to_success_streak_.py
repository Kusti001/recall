"""rename reviews_count to success_streak, add total_reviews

Revision ID: 813e2e16ae17
Revises: a3fc6786f7d9
Create Date: 2026-08-11 13:14:23.794590

"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "813e2e16ae17"
down_revision: str | Sequence[str] | None = "a3fc6786f7d9"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    """Upgrade schema."""
    op.alter_column("card", "reviews_count", new_column_name="success_streak")
    op.add_column(
        "card",
        sa.Column("total_reviews", sa.Integer(), nullable=False, server_default="0"),
    )
    op.execute("""
            UPDATE card
            SET total_reviews = (
                SELECT COUNT(*) FROM review WHERE review.card_id = card.id
            )
        """)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column("card", "total_reviews")
    op.alter_column("card", "success_streak", new_column_name="reviews_count")
