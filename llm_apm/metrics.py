from prometheus_client import Counter, Histogram

# ---- REQUEST LEVEL ----
REQUEST_COUNT = Counter(
    "llm_requests_total",
    "Total number of LLM requests",
    ["endpoint", "method", "status"]
)

REQUEST_LATENCY = Histogram(
    "llm_request_latency_seconds",
    "End-to-end request latency",
    ["endpoint"]
)

# ---- STEP LEVEL (THIS FIXES STEP LATENCY PANEL) ----
STEP_LATENCY = Histogram(
    "llm_step_latency_seconds",
    "Latency per LLM step",
    ["step"],
    buckets=(0.05, 0.1, 0.2, 0.3, 0.5, 1, 2, 5)
)

STEP_ERRORS = Counter(
    "llm_errors_total",
    "Errors per LLM step",
    ["step"]
)

# ---- TOKEN & COST ----
TOKEN_USAGE = Counter(
    "llm_tokens_total",
    "Total tokens used",
    ["type"]
)

MODEL_TOKEN_USAGE = Counter(
    "llm_model_tokens_total",
    "Tokens used per model",
    ["model", "type"]
)

REQUEST_COST = Counter(
    "llm_cost_usd",
    "Total USD cost of LLM requests"
)
