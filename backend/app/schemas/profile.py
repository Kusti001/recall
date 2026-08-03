from datetime import date

from pydantic import BaseModel


class HeatmapDay(BaseModel):
    date: date
    count: int


class ProfileStats(BaseModel):
    display_name: str
    created_at: date
    retention_30d: float
    current_streak: int
    cards_studied: int
    due_today: int
    average_interval: float
    heatmap: list[HeatmapDay]
