from datetime import datetime, timedelta, timezone

from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories import AdminRepository


class AdminService:
    def __init__(self, session: AsyncSession):
        self.repository = AdminRepository(session)

    async def get_user_stats(self) -> dict[str, int]:
        now = datetime.now(timezone.utc)

        day_ago = now - timedelta(days=1)
        week_ago = now - timedelta(days=7)

        total_users = await self.repository.count_users()

        active_today = await self.repository.count_active_users(
            since=day_ago,
        )

        active_this_week = await self.repository.count_active_users(
            since=week_ago,
        )

        new_this_week = await self.repository.count_new_users(
            since=week_ago,
        )

        return {
            "total_users": total_users,
            "active_today": active_today,
            "active_this_week": active_this_week,
            "new_this_week": new_this_week,
        }

    async def get_cards_stats(self) -> dict[str, int]:
        now = datetime.now(timezone.utc)

        day_ago = now - timedelta(days=1)

        total_cards = await self.repository.count_cards()
        total_decks = await self.repository.count_decks()

        created_today = await self.repository.count_created_cards(
            since=day_ago,
        )

        reviews_today = await self.repository.count_reviews(
            since=day_ago,
        )

        return {
            "total_cards": total_cards,
            "total_decks":total_decks,
            "created_today": created_today,
            "reviews_today": reviews_today,
        }
