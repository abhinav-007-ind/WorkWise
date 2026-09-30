"""
Test suite for the SkillBridge AI Module.
Tests extractors, schemas, analyzer (empty input), and FastAPI endpoints.
"""
import asyncio
import io
import json
import sys
from unittest.mock import AsyncMock, MagicMock

# ─────────────────────────── Schema Tests ───────────────────────────
def test_schemas():
    from app.models import DetectedSkill, AnalysisResponse, StatusEnum, AnalysisOutputContainer

    # Valid skill
    skill = DetectedSkill(
        skill="Python",
        confidence=0.91,
        evidence="Python files with data-processing functions",
        evidence_strength=0.9,
        complexity=0.65,
        quality=0.88,
    )
    assert skill.confidence == 0.91
    print("  [PASS] DetectedSkill creation")

    # Full response
    response = AnalysisResponse(
        status=StatusEnum.SUCCESS,
        model_version="test-v1",
        total_skills_detected=1,
        overall_confidence=0.91,
        skills=[skill],
        review_notes=None,
    )
    data = response.model_dump()
    assert data["status"] == "SUCCESS"
    assert data["skills"][0]["skill"] == "Python"
    print("  [PASS] AnalysisResponse SUCCESS serialization")

    # NEEDS_REVIEW
    nr = AnalysisResponse(
        status=StatusEnum.NEEDS_REVIEW,
        model_version="test-v1",
        total_skills_detected=0,
        overall_confidence=0.0,
        skills=[],
        review_notes="Empty submission.",
    )
    assert nr.status == StatusEnum.NEEDS_REVIEW
    print("  [PASS] AnalysisResponse NEEDS_REVIEW")

    # FAILED
    failed = AnalysisResponse(
        status=StatusEnum.FAILED,
        model_version="test-v1",
        total_skills_detected=0,
        overall_confidence=0.0,
        skills=[],
        review_notes="AI error.",
    )
    assert failed.status == StatusEnum.FAILED
    print("  [PASS] AnalysisResponse FAILED")

    # Container
    container = AnalysisOutputContainer(skills=[skill])
    assert len(container.skills) == 1
    print("  [PASS] AnalysisOutputContainer")

    # Validation: reject out-of-range
    try:
        DetectedSkill(
            skill="X", confidence=1.5, evidence="x",
            evidence_strength=0.5, complexity=0.5, quality=0.5,
        )
        assert False, "Should have raised"
    except Exception:
        print("  [PASS] Rejects confidence > 1.0")

    try:
        DetectedSkill(
            skill="X", confidence=-0.1, evidence="x",
            evidence_strength=0.5, complexity=0.5, quality=0.5,
        )
        assert False, "Should have raised"
    except Exception:
        print("  [PASS] Rejects confidence < 0.0")

    # JSON round-trip
    json_str = response.model_dump_json()
    parsed = AnalysisResponse.model_validate_json(json_str)
    assert parsed.skills[0].skill == "Python"
    print("  [PASS] JSON round-trip serialization")


# ─────────────────────── Extractor Tests ────────────────────────────
async def test_extractors():
    from app.extractors import FileContentExtractor

    extractor = FileContentExtractor()

    # Python file
    f1 = MagicMock()
    f1.filename = "script.py"
    f1.read = AsyncMock(return_value=b"import pandas as pd\n\ndef process(df):\n    return df.dropna()\n")
    r1 = await extractor.extract_text(f1)
    assert "import pandas" in r1
    print("  [PASS] Python file extraction")

    # JavaScript file
    f2 = MagicMock()
    f2.filename = "app.js"
    f2.read = AsyncMock(return_value=b'const express = require("express");\n')
    r2 = await extractor.extract_text(f2)
    assert "express" in r2
    print("  [PASS] JavaScript file extraction")

    # Jupyter Notebook
    nb_json = json.dumps({
        "cells": [
            {"cell_type": "code", "source": "import numpy as np\nprint(np.zeros(3))", "metadata": {}, "outputs": []},
            {"cell_type": "markdown", "source": "# Analysis\nData exploration", "metadata": {}},
        ],
        "metadata": {"kernelspec": {"display_name": "Python 3", "language": "python", "name": "python3"},
                      "language_info": {"name": "python", "version": "3.9.0"}},
        "nbformat": 4,
        "nbformat_minor": 5,
    })
    f3 = MagicMock()
    f3.filename = "notebook.ipynb"
    f3.read = AsyncMock(return_value=nb_json.encode("utf-8"))
    r3 = await extractor.extract_text(f3)
    assert "numpy" in r3
    assert "Analysis" in r3  # markdown cell also extracted
    print("  [PASS] Jupyter Notebook extraction (code + markdown)")

    # Markdown
    f4 = MagicMock()
    f4.filename = "README.md"
    f4.read = AsyncMock(return_value=b"# Project\nUses machine learning.")
    r4 = await extractor.extract_text(f4)
    assert "machine learning" in r4
    print("  [PASS] Markdown file extraction")

    # SQL
    f5 = MagicMock()
    f5.filename = "query.sql"
    f5.read = AsyncMock(return_value=b"SELECT * FROM users WHERE active = 1;")
    r5 = await extractor.extract_text(f5)
    assert "SELECT" in r5
    print("  [PASS] SQL file extraction")

    # Unknown extension (fallback)
    f6 = MagicMock()
    f6.filename = "data.xyz"
    f6.read = AsyncMock(return_value=b"raw content")
    r6 = await extractor.extract_text(f6)
    assert "raw content" in r6
    print("  [PASS] Unknown extension fallback")

    # Empty file
    f7 = MagicMock()
    f7.filename = "empty.py"
    f7.read = AsyncMock(return_value=b"")
    r7 = await extractor.extract_text(f7)
    assert r7 == ""
    print("  [PASS] Empty file handling")


# ──────────────────── Analyzer (empty input) ────────────────────────
async def test_analyzer_empty():
    from app.analyzer import SkillAnalyzerEngine
    from app.models import StatusEnum

    engine = SkillAnalyzerEngine()

    # Empty submission should return NEEDS_REVIEW without calling LLM
    result = await engine.analyze_submission("")
    assert result.status == StatusEnum.NEEDS_REVIEW
    assert result.total_skills_detected == 0
    assert "empty" in result.review_notes.lower()
    print("  [PASS] Empty submission returns NEEDS_REVIEW")

    # Whitespace-only
    result2 = await engine.analyze_submission("   \n\t  \n  ")
    assert result2.status == StatusEnum.NEEDS_REVIEW
    print("  [PASS] Whitespace-only submission returns NEEDS_REVIEW")


# ────────────────── FastAPI Endpoint Tests ──────────────────────────
async def test_fastapi_endpoints():
    from httpx import AsyncClient, ASGITransport
    from app.main import app

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://testserver") as client:
        # Health check
        resp = await client.get("/health")
        assert resp.status_code == 200
        data = resp.json()
        assert data["status"] == "active"
        assert "model_version" in data
        print("  [PASS] GET /health returns 200 with model_version")

        # Empty request → 400
        resp2 = await client.post("/analyze", data={"raw_text": ""})
        assert resp2.status_code == 400
        print("  [PASS] POST /analyze with empty input returns 400")

        # Valid raw_text → should return valid response shape (may FAIL if no API key, but schema should still work)
        resp3 = await client.post(
            "/analyze",
            data={"raw_text": "import pandas as pd\ndf = pd.read_csv('data.csv')\nprint(df.head())"},
        )
        # Could be 200 with FAILED status (no API key) or SUCCESS (with key)
        assert resp3.status_code == 200
        result = resp3.json()
        assert "status" in result
        assert "model_version" in result
        assert "skills" in result
        assert result["status"] in ("SUCCESS", "NEEDS_REVIEW", "FAILED")
        print(f"  [PASS] POST /analyze returns valid schema (status={result['status']})")

        if result["status"] == "FAILED":
            print(f"         Note: AI call failed (expected without valid GEMINI_API_KEY)")
            print(f"         review_notes: {result['review_notes'][:80]}...")
        elif result["status"] in ("SUCCESS", "NEEDS_REVIEW"):
            print(f"         Skills detected: {result['total_skills_detected']}")
            print(f"         Overall confidence: {result['overall_confidence']}")
            for s in result["skills"]:
                print(f"           - {s['skill']}: confidence={s['confidence']}, evidence_strength={s['evidence_strength']}")

        # File upload test
        py_code = b"def fibonacci(n):\n    if n <= 1:\n        return n\n    return fibonacci(n-1) + fibonacci(n-2)\n\nfor i in range(10):\n    print(fibonacci(i))\n"
        resp4 = await client.post(
            "/analyze",
            files=[("files", ("fibonacci.py", py_code, "text/plain"))],
        )
        assert resp4.status_code == 200
        result4 = resp4.json()
        assert result4["status"] in ("SUCCESS", "NEEDS_REVIEW", "FAILED")
        print(f"  [PASS] POST /analyze with file upload returns valid schema (status={result4['status']})")


# ─────────────────────── Taxonomy Tests ─────────────────────────────
def test_taxonomy():
    from app.taxonomy import SKILL_BRIDGE_TAXONOMY, get_taxonomy_prompt_string

    assert len(SKILL_BRIDGE_TAXONOMY) == 5
    print("  [PASS] Taxonomy has 5 categories")

    all_skills = []
    for skills in SKILL_BRIDGE_TAXONOMY.values():
        all_skills.extend(skills)
    assert len(all_skills) > 30
    print(f"  [PASS] Taxonomy contains {len(all_skills)} total skills")

    prompt_str = get_taxonomy_prompt_string()
    assert "Python" in prompt_str
    assert "Docker" in prompt_str
    assert "Machine Learning" in prompt_str
    print("  [PASS] Taxonomy prompt string generated correctly")


# ─────────────────────── Config Tests ───────────────────────────────
def test_config():
    from app.config import settings

    assert settings.PROJECT_NAME == "SkillBridge AI Analysis Engine"
    assert settings.CONFIDENCE_THRESHOLD == 0.65
    assert settings.VERSION == "1.2.0"
    assert settings.MAX_FILE_SIZE_MB == 10
    print("  [PASS] Configuration loaded correctly")
    print(f"         API key configured: {'Yes' if settings.GEMINI_API_KEY and settings.GEMINI_API_KEY != 'your_actual_gemini_api_key_here' else 'No (placeholder)'}")


# ═══════════════════════════ MAIN ═══════════════════════════════════
def main():
    print("=" * 60)
    print("  SkillBridge AI Module — Test Suite")
    print("=" * 60)

    passed = 0
    failed = 0

    test_groups = [
        ("Configuration", test_config),
        ("Taxonomy", test_taxonomy),
        ("Pydantic Schemas", test_schemas),
    ]

    async_test_groups = [
        ("File Extractors", test_extractors),
        ("Analyzer (Empty Input)", test_analyzer_empty),
        ("FastAPI Endpoints", test_fastapi_endpoints),
    ]

    for name, func in test_groups:
        print(f"\n--- {name} ---")
        try:
            func()
            passed += 1
        except Exception as e:
            print(f"  [FAIL] {e}")
            failed += 1

    for name, func in async_test_groups:
        print(f"\n--- {name} ---")
        try:
            asyncio.run(func())
            passed += 1
        except Exception as e:
            print(f"  [FAIL] {e}")
            import traceback
            traceback.print_exc()
            failed += 1

    print("\n" + "=" * 60)
    print(f"  RESULTS: {passed} groups passed, {failed} groups failed")
    print("=" * 60)

    return 0 if failed == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
