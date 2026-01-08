import time
from starlette.middleware.base import BaseHTTPMiddleware

from llm_apm.metrics import REQUEST_COUNT, REQUEST_LATENCY
from llm_apm.context import start_request


class APMMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        request_id = start_request()

        start = time.perf_counter()
        response = None

        try:
            response = await call_next(request)
            return response
        finally:
            duration = time.perf_counter() - start
            status = response.status_code if response else 500

            REQUEST_COUNT.labels(
                endpoint=request.url.path,
                method=request.method,
                status=status
            ).inc()

            REQUEST_LATENCY.labels(
                endpoint=request.url.path
            ).observe(duration)

            if response:
                response.headers["X-Request-ID"] = request_id
