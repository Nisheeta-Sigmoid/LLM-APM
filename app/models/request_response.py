from pydantic import BaseModel

class GenerateRequest(BaseModel):
    prompt: str
    max_tokens: int = 100

class GenerateResponse(BaseModel):
    response: str
    tokens_used: int
