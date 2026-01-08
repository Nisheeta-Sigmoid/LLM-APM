FROM python:3.11-slim

WORKDIR /app

# Install system deps (optional but safe)
RUN apt-get update && apt-get install -y gcc curl && rm -rf /var/lib/apt/lists/*

# Copy backend code
COPY app ./app
COPY llm_apm ./llm_apm

# Install python deps
RUN pip install --no-cache-dir -r app/requirements.txt

EXPOSE 4000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "4000"]
