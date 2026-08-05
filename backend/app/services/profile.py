from datetime import UTC, date, datetime, timedelta

from sqlalchemy.ext.asyncio import AsyncSession

from app.models import User
from app.repositories import CardRepository, DeckRepository, ReviewRepository
from app.schemas import HeatmapDay, ProfileStats


def calculate_streak(review_days: list[date]) -> int:
    if not review_days:
        return 0

    today = datetime.now(tz=UTC).date()
    # если сегодня ещё не повторяли - стрик считается от вчера
    expected = today if review_days[0] == today else today - timedelta(days=1)

    streak = 0
    for day in review_days:
        if day == expected:
            streak += 1
            expected -= timedelta(days=1)
        else:
            break
    return streak


class ProfileService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.decks = DeckRepository(session)
        self.reviews = ReviewRepository(session)
        self.cards = CardRepository(session)

    async def get_profile_stats(self, user: User):
        review_days = await self.reviews.get_current_streak(user.id)
        current_streak = calculate_streak(review_days)
        cards_studied = await self.cards.get_cards_studied_count(user.id)
        due_today = await self.cards.get_due_cards_count(user.id)
        average_interval = await self.cards.get_average_interval(user.id)
        heatmap_rows = await self.reviews.get_review_heatmap(user.id)

        result = await self.reviews.get_retention_30d(user.id)
        if result.total == 0:
            retention_30d = 0.0
        else:
            retention_30d = round(result.successful / result.total * 100, 1)

        return ProfileStats(
            display_name=user.email.split("@")[0],
            created_at=user.created_at.date(),
            retention_30d=retention_30d,
            current_streak=current_streak,
            cards_studied=cards_studied,
            due_today=due_today,
            average_interval=round(average_interval,1),
            heatmap=[
                HeatmapDay(date=row._mapping["date"], count=row._mapping["count"])
                for row in heatmap_rows
            ],
        )
