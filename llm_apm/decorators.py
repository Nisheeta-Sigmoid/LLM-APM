# import time
# from functools import wraps
# from tracemalloc import start

# from llm_apm.metrics import SPAN_LATENCY, SPAN_ERRORS
# from llm_apm.context import push_span, pop_span, get_request_id

# def step(name: str, model: str = "unknown"):
#     def decorator(fn):
#         @wraps(fn)
#         def wrapper(*args, **kwargs):
#             parent = push_span(name)
#             start = time.perf_counter()
#             status = "success"

#             try:
#                 return fn(*args, **kwargs)

#             except Exception:
#                 status = "error"
#                 SPAN_ERRORS.labels(
#                     span=name,
#                     model=model
#                 ).inc()
#                 raise

#             finally:
#                 duration = time.perf_counter() - start
#                 SPAN_LATENCY.labels(
#                     span=name   
#                 ).observe(duration)
#                 pop_span()
#         return wrapper
#     return decorator


import time
from functools import wraps

from llm_apm.metrics import STEP_LATENCY, STEP_ERRORS

def step(name: str, model: str = "unknown"):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            start = time.perf_counter()
            try:
                return fn(*args, **kwargs)
            except Exception:
                STEP_ERRORS.labels(step=name).inc()
                raise
            finally:
                duration = time.perf_counter() - start
                STEP_LATENCY.labels(step=name).observe(duration)
        return wrapper
    return decorator
