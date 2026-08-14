import asyncio

from google import genai

from app.core.config import settings
from app.core.constants import SYSTEM_PROMPT
from app.schemas import GeneratedDeck


class AIService:
    def __init__(self):
        self.client = genai.Client(
            api_key=settings.GEMINI_API_KEY,
        )

    async def generate_deck(
        self,
        prompt: str,
        card_count: int,
    ) -> GeneratedDeck:
        user_prompt = f"""
Create a flashcard deck with exactly {card_count} flashcards about the following topic:

{prompt}
"""

        interaction = await asyncio.to_thread(
            self.client.interactions.create,
            model="gemini-3.5-flash-lite",
            system_instruction=SYSTEM_PROMPT,
            input=user_prompt,
            response_format={
                "type": "text",
                "mime_type": "application/json",
                "schema": GeneratedDeck.model_json_schema(),
            },
        )

        return GeneratedDeck.model_validate_json(interaction.output_text)
