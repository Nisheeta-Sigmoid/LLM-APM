🚀 LLM-APM
Real-Time Observability for LLM-Powered Applications

Chatbot • Step-wise Latency • Token & Cost Tracking • Prometheus • Grafana

🧠 Overview

LLM-APM is an end-to-end Application Performance Monitoring (APM) platform specifically designed for LLM applications.

This project goes beyond a basic /generate API and implements:

💬 A ChatGPT-style chatbot

📊 A custom frontend performance dashboard

🧩 A plug-and-play Python APM library (llm_apm)

📈 Prometheus + Grafana observability stack

🧠 Step-wise latency tracking via middleware & decorators

The goal is to make LLM systems observable, debuggable, and cost-aware.

🎯 Problem Statement

LLM applications are:

Latency-sensitive ⏱️

Costly 💸

Operationally opaque 🕳️

Traditional APM tools fail to answer:

Which internal step is slow?

How many tokens are used per request?

What is the real cost per interaction?

Are errors increasing over time?

👉 LLM-APM solves this by introducing LLM-native observability.

✨ Key Capabilities
🧠 LLM Application (FastAPI)

Chatbot-based request handling

Central request lifecycle tracking

Middleware-driven latency measurement

Internal LLM configuration (no user-supplied max_tokens)

/metrics endpoint for Prometheus

🧩 llm_apm Python Library

Reusable, installable APM library providing:

Request context propagation

Step-wise elapsed time tracking

Token usage aggregation

Cost estimation

Error classification

Prometheus metric exporters

Decorators for step instrumentation

@step("llm_api_call")
def call_llm(...):
    ...

💬 Frontend Chatbot (React + Vite)

ChatGPT-style conversational UI

Sends user messages to backend

No manual configuration from user

Automatically generates metrics

📊 Frontend Dashboard

Custom-built UI showing:

Total requests

Average latency

Error rate

Total token usage

Per-request history

Expandable request-level details

This dashboard is not Grafana — it is a custom frontend, which is a major strength of this project.

📈 Observability Stack

Prometheus → Metrics collection

Grafana → Time-series visualization & alerts

Supports:

1m / 5m / 1h / 24h latency trends

Error rate monitoring

Token & cost trends

🏗️ Architecture
User (Browser)
   ↓
React Frontend
   ├── Chatbot
   └── Dashboard
   ↓
FastAPI Backend
   ├── APM Middleware
   ├── Step Decorators
   ├── LLM Client
   └── /metrics
   ↓
Prometheus
   ↓
Grafana

⚙️ Request Lifecycle (Step-wise Tracking)

User sends a chat message

Middleware starts overall timer

Steps executed:

Preprocessing

LLM API call

Response parsing

Metrics export

Tokens & cost calculated

Metrics exposed to Prometheus

Dashboards update in real time

📂 Project Structure (EXACT — FROM YOUR SCREENSHOT)
LLM-APM/
├── .vscode/
│   └── settings.json
│
├── app/
│   ├── __pycache__/
│   ├── dependencies/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── __init__.py
│   ├── config.py
│   ├── main.py
│   ├── requirements.txt
│   └── state.py
│
├── docker/
│   ├── docker-compose.yml
│   ├── Dockerfile
│   └── Dockerfile_apm
│
├── frontend/
│   ├── node_modules/
│   ├── public/
│   ├── src/
│   ├── .env
│   ├── .gitignore
│   ├── Dockerfile
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.js
│   ├── README.md
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── llm_apm/
│   ├── __pycache__/
│   ├── llm_apm.egg-info/
│   ├── __init__.py
│   ├── config.py
│   ├── context.py
│   ├── cost.py
│   ├── decorators.py
│   ├── errors.py
│   ├── metrics.py
│   ├── middleware.py
│   ├── README.md
│   └── utils.py
│
├── observability/
│   ├── grafana/
│   │   └── dashboards/
│   └── prometheus/
│       ├── alert-rules.yml
│       ├── alert.yml
│       ├── prometheus.yml
│       └── recording-rules.yml
│
├── .env
├── .gitignore
└── README.md

🐳 Containerization

Backend, frontend, Prometheus, and Grafana are containerized

docker-compose.yml orchestrates the full stack

Easy local startup & reproducibility

📊 Metrics Exposed

Examples:

llm_requests_total

llm_request_latency_seconds

llm_step_latency_seconds

llm_tokens_total

llm_cost_usd_total

llm_errors_total

