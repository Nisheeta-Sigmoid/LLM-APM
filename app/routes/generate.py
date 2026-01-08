import time
from fastapi import APIRouter
from app.models.request_response import GenerateRequest, GenerateResponse
from app.services.llm_client import llm_call
from app.state import chat_events

from llm_apm.decorators import step
from llm_apm.tokens import count_tokens
from llm_apm.cost import calculate_cost
from llm_apm.metrics import TOKEN_USAGE, REQUEST_COST
from app.state import chat_events, _event_id

router = APIRouter()


@router.post("/generate", response_model=GenerateResponse)
@step("http_generate")
def generate_text(request: GenerateRequest):

    steps = {}

    # ---- Preprocessing ----
    t0 = time.perf_counter()

    @step("preprocessing")
    def preprocess(prompt: str) -> str:
        return prompt.strip()

    prompt = preprocess(request.prompt)
    steps["preprocessing"] = round((time.perf_counter() - t0) * 1000, 2)

    # ---- LLM Call ----
    t1 = time.perf_counter()

    response, prompt_tokens, completion_tokens = llm_call(
        prompt,
        request.max_tokens
    )

    steps["llm_call"] = round((time.perf_counter() - t1) * 1000, 2)

    # ---- Postprocessing ----
    t2 = time.perf_counter()

    @step("postprocessing")
    def postprocess(resp: str):
        tokens_used = count_tokens(resp)
        cost = calculate_cost(prompt_tokens, completion_tokens)
        return tokens_used, cost

    tokens_used, cost = postprocess(response)
    steps["postprocessing"] = round((time.perf_counter() - t2) * 1000, 2)

    # ---- Metrics Export ----
    t3 = time.perf_counter()

    TOKEN_USAGE.labels(type="prompt").inc(prompt_tokens)
    TOKEN_USAGE.labels(type="completion").inc(completion_tokens)
    REQUEST_COST.inc(cost)

    steps["metrics_export"] = round((time.perf_counter() - t3) * 1000, 2)

    # ---- Save event for dashboard ----
    chat_events.insert(0, {
        "id": next(_event_id),   # ✅ ADD THIS LINE
        "prompt": request.prompt,
        "status": "success",
        "latency": sum(steps.values()),
        "tokens": tokens_used,
        "timestamp": time.strftime("%H:%M:%S"),
        "details": {
            "promptTokens": prompt_tokens,
            "completionTokens": completion_tokens,
            "cost": cost,
            "steps": steps,
            "errorRate": "0%",
        }
    })

    return {
        "response": response,
        "tokens_used": tokens_used,
        "cost": cost
    }
