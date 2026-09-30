# =============================================================================
# SkillBridge AI Module - Dockerfile
# Production-ready container for the FastAPI-based AI analysis service.
# =============================================================================

# ---------------------------------------------------------------------------
# Stage 1: Builder – install Python dependencies in an isolated layer
# ---------------------------------------------------------------------------
FROM python:3.12-slim AS builder

WORKDIR /build

# Copy only requirements first to maximise Docker layer caching.
# Dependencies change far less often than application code.
COPY requirements.txt .

RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

# ---------------------------------------------------------------------------
# Stage 2: Runtime – lean final image with only what's needed to run
# ---------------------------------------------------------------------------
FROM python:3.12-slim AS runtime

LABEL maintainer="SkillBridge Team <skillbridge@example.com>"
LABEL description="SkillBridge AI Module – FastAPI service for resume/skill analysis powered by Gemini."

# Prevent Python from writing .pyc files and enable unbuffered stdout/stderr
# so container logs are emitted in real-time.
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Bring over the pre-built site-packages from the builder stage.
COPY --from=builder /install /usr/local

# Copy application source code.
COPY app/ ./app/

# The service listens on port 8000.
EXPOSE 8000

# Run the FastAPI app via uvicorn.
# --host 0.0.0.0 ensures the server is reachable from outside the container.
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
