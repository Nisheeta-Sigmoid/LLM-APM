import time
from llm_apm.decorators import step
from llm_apm.tokens import count_tokens
from llm_apm.metrics import MODEL_TOKEN_USAGE, REQUEST_COST

from app.dependencies.groq_client import get_groq_client

# ---- Single source of truth ----
MODEL_NAME = "llama-3.1-8b-instant"

@step("groq_llm_call", model=MODEL_NAME)
def llm_call(prompt: str, max_tokens: int):
    client = get_groq_client()

    completion = client.chat.completions.create(
        model=MODEL_NAME,
        messages=[{"role": "user", "content": prompt}],
        max_tokens=max_tokens,
    )

    response = completion.choices[0].message.content

    # ---- Token accounting ----
    prompt_tokens = count_tokens(prompt)
    completion_tokens = count_tokens(response)

    MODEL_TOKEN_USAGE.labels(
        model=MODEL_NAME,
        type="prompt"
    ).inc(prompt_tokens)

    MODEL_TOKEN_USAGE.labels(
        model=MODEL_NAME,
        type="completion"
    ).inc(completion_tokens)

    # ✅ COST METRIC (THIS FIXES GRAFANA)   
    REQUEST_COST.inc(0.0001)

    return response, prompt_tokens, completion_tokens
