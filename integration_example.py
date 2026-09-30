"""
integration_example.py – How to call the SkillBridge AI Module from the backend.

Prerequisites
-------------
1. pip install httpx
2. The AI module must be running:
       uvicorn app.main:app --reload        # (from the project root)
   or:
       docker run -p 8000:8000 skillbridge-ai

Usage
-----
    python integration_example.py

This script demonstrates two ways to hit the /analyze endpoint:
  • Sending raw resume text in JSON
  • Uploading a file (e.g. a .txt or .pdf resume)
"""

from __future__ import annotations

import asyncio
import json
import sys
from pathlib import Path

import httpx

# ---------------------------------------------------------------------------
# Configuration – change these to match your setup
# ---------------------------------------------------------------------------
BASE_URL = "http://localhost:8000"
ANALYZE_ENDPOINT = f"{BASE_URL}/analyze"

# Timeout for each request (seconds).  Gemini calls can take a moment.
REQUEST_TIMEOUT = 60.0


# ==========================================================================
# Helper: pretty-print the API response
# ==========================================================================
def print_response(label: str, response: httpx.Response) -> None:
    """Format and print an API response to the console."""
    print(f"\n{'=' * 60}")
    print(f"  {label}")
    print(f"{'=' * 60}")
    print(f"  Status : {response.status_code}")
    print(f"  URL    : {response.url}")
    print("-" * 60)

    try:
        data = response.json()
        print(json.dumps(data, indent=2, ensure_ascii=False))
    except Exception:
        # If the response isn't JSON, just print the raw text.
        print(response.text)

    print("=" * 60)


# ==========================================================================
# Example 1: Analyse raw resume text (JSON body)
# ==========================================================================
async def example_raw_text(client: httpx.AsyncClient) -> None:
    """
    Send plain resume text to the /analyze endpoint.

    The backend can collect text from a form field, database record, or
    any other source and pass it directly as a JSON payload.
    """
    sample_resume_text = (
        "John Doe\n"
        "Software Engineer with 5 years of experience.\n\n"
        "Skills: Python, FastAPI, Docker, PostgreSQL, React, AWS\n\n"
        "Experience:\n"
        "- Backend Developer at TechCorp (2021-present)\n"
        "  Built microservices with FastAPI and deployed on AWS ECS.\n"
        "- Junior Developer at StartupXYZ (2019-2021)\n"
        "  Developed REST APIs and integrated third-party services.\n\n"
        "Education:\n"
        "- B.Sc. Computer Science, State University (2019)\n"
    )

    # POST the text as JSON.  Adjust the field name ("raw_text") to match
    # whatever the /analyze endpoint expects.
    response = await client.post(
        ANALYZE_ENDPOINT,
        json={"raw_text": sample_resume_text},
        timeout=REQUEST_TIMEOUT,
    )

    print_response("Example 1 – Raw Text Analysis", response)


# ==========================================================================
# Example 2: Upload a resume file
# ==========================================================================
async def example_file_upload(client: httpx.AsyncClient) -> None:
    """
    Upload a file to the /analyze endpoint using multipart/form-data.

    This mirrors how a frontend file-upload or a backend file-processing
    pipeline would send a resume to the AI module.
    """
    # For this demo we create a small temporary file.  In production you'd
    # open the actual file the user uploaded.
    sample_file = Path("sample_resume.txt")

    # Create a sample file if it doesn't exist yet.
    if not sample_file.exists():
        sample_file.write_text(
            "Jane Smith\n"
            "Data Scientist | ML Engineer\n\n"
            "Skills: Python, TensorFlow, PyTorch, SQL, Spark, Tableau\n\n"
            "Experience:\n"
            "- Senior Data Scientist at DataCo (2022-present)\n"
            "  Led a team building recommendation systems.\n"
            "- ML Engineer at AI Labs (2020-2022)\n"
            "  Developed NLP pipelines for document classification.\n\n"
            "Education:\n"
            "- M.Sc. Machine Learning, Tech University (2020)\n",
            encoding="utf-8",
        )
        print(f"[info] Created sample resume file: {sample_file.resolve()}")

    # Upload the file.  The field name "file" should match the FastAPI
    # endpoint's parameter name (e.g.  file: UploadFile).
    with open(sample_file, "rb") as f:
        response = await client.post(
            ANALYZE_ENDPOINT,
            files={"file": (sample_file.name, f, "text/plain")},
            timeout=REQUEST_TIMEOUT,
        )

    print_response("Example 2 – File Upload Analysis", response)


# ==========================================================================
# Main – run both examples sequentially
# ==========================================================================
async def main() -> None:
    print("SkillBridge AI Module – Integration Examples")
    print(f"Target: {BASE_URL}\n")

    # Create a single async client to reuse the underlying connection pool.
    async with httpx.AsyncClient() as client:
        # ------------------------------------------------------------------
        # Quick health check – make sure the server is reachable.
        # ------------------------------------------------------------------
        try:
            health = await client.get(f"{BASE_URL}/", timeout=5.0)
            print(f"[✓] Server is reachable (status {health.status_code})")
        except httpx.ConnectError:
            print(
                "[✗] Could not connect to the AI module.\n"
                "    Make sure the server is running:\n"
                "        uvicorn app.main:app --reload\n"
            )
            sys.exit(1)

        # ------------------------------------------------------------------
        # Run the examples
        # ------------------------------------------------------------------
        await example_raw_text(client)
        await example_file_upload(client)

    print("\n[done] All examples finished.")


if __name__ == "__main__":
    asyncio.run(main())
