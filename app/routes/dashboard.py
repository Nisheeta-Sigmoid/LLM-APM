from fastapi import APIRouter
from app.state import chat_events

router = APIRouter()

@router.get("/dashboard")
def get_dashboard():
    total_requests = len(chat_events)

    if total_requests == 0:
        return {
            "overall": {
                "total_requests": 0,
                "avg_latency_ms": 0,
                "error_rate": 0,
                "total_tokens": 0,
            },
            "messages": []
        }

    total_latency = sum(e["latency"] for e in chat_events)
    total_tokens = sum(e["tokens"] for e in chat_events)
    error_count = sum(1 for e in chat_events if e["status"] != "success")

    return {
        "overall": {
            "total_requests": total_requests,
            "avg_latency_ms": round(total_latency / total_requests, 2),
            "error_rate": round((error_count / total_requests) * 100, 2),
            "total_tokens": total_tokens,
        },
        "messages": chat_events
    }
