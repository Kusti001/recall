"""add status field and override_flag to card model

Revision ID: a3fc6786f7d9
Revises: 43c35cd64930
Create Date: 2026-08-11 12:46:37.827730

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "a3fc6786f7d9"
down_revision: Union[str, Sequence[str], None] = "43c35cd64930"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    card_status_enum = sa.Enum("new", "learning", "mastered", name="card_status")
    card_status_enum.create(op.get_bind(), checkfirst=True)

    op.add_column(
        "card",
        sa.Column("status", card_status_enum, nullable=False, server_default="new"),
    )
    op.add_column(
        "card",
        sa.Column(
            "status_override", sa.Boolean(), nullable=False, server_default="false"
        ),
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column("card", "status_override")
    op.drop_column("card", "status")
    sa.Enum(name="card_status").drop(op.get_bind(), checkfirst=True)
