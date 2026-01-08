from groq import Groq
from app.config import get_settings

def get_groq_client() -> Groq:
    settings = get_settings()
    return Groq(api_key=settings.groq_api_key)
