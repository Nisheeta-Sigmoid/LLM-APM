from fastapi import FastAPI
from fastapi.responses import Response
from prometheus_client import generate_latest, CONTENT_TYPE_LATEST

from app.routes.generate import router
from llm_apm.middleware import APMMiddleware
from fastapi.middleware.cors import CORSMiddleware
from app.routes.dashboard import router as dashboard_router

app = FastAPI(title="LLM-APM Demo", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(APMMiddleware)
app.include_router(router)
app.include_router(dashboard_router)

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/metrics")
def metrics():
    return Response(generate_latest(), media_type=CONTENT_TYPE_LATEST)
