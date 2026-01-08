import time
from starlette.middleware.base import BaseHTTPMiddleware
from prometheus_client import Counter, Histogram

REQUEST_LATENCY = Histogram(
    "llm_request_latency_seconds",
    "Total request latency",
    ["path"]
)

REQUEST_COUNT = Counter(
    "llm_requests_total",
    "Total number of requests",
    ["path", "status"]
)

class LLMApmMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        start_time = time.perf_counter()
        response = await call_next(request)
        elapsed = time.perf_counter() - start_time

        REQUEST_LATENCY.labels(path=request.url.path).observe(elapsed)
        REQUEST_COUNT.labels(
            path=request.url.path,
            status=response.status_code
        ).inc()

        return response
