import uuid
from contextvars import ContextVar

request_id_ctx = ContextVar("request_id", default=None)
span_stack_ctx = ContextVar("span_stack", default=[])

def start_request():
    rid = str(uuid.uuid4())
    request_id_ctx.set(rid)
    span_stack_ctx.set([])
    return rid

def get_request_id():
    return request_id_ctx.get()

def push_span(span: str):
    stack = span_stack_ctx.get()
    parent = stack[-1] if stack else "root"
    span_stack_ctx.set(stack + [span])
    return parent

def pop_span():
    stack = span_stack_ctx.get()
    span_stack_ctx.set(stack[:-1])
