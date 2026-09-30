# SkillBridge AI Analysis Engine 🤖

**Production-ready AI/ML module** that analyzes student submissions and identifies demonstrated technical skills with confidence scores, evidence, and quality metrics.

## Architecture

```
skillbridge-ai-module/
├── app/
│   ├── __init__.py          # Package marker
│   ├── config.py            # Settings from .env
│   ├── taxonomy.py          # SkillBridge skill taxonomy
│   ├── models.py            # Pydantic request/response schemas
│   ├── extractors.py        # Multi-format file content extractors
│   ├── analyzer.py          # LLM skill detection engine (Gemini)
│   └── main.py              # FastAPI service entry point
├── .env                     # Environment variables (API keys)
├── .gitignore
├── requirements.txt
└── README.md
```

## Quick Start

### 1. Create & activate virtual environment

```bash
python -m venv venv

# Windows:
venv\Scripts\activate

# macOS / Linux:
source venv/bin/activate
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure your Gemini API key

Edit `.env` and replace the placeholder:

```
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

Get a free key at [Google AI Studio](https://aistudio.google.com/).

### 4. Start the server

```bash
python -m app.main
```

### 5. Open Swagger docs

Navigate to **http://localhost:8000/docs** to explore and test the API interactively.

---

## API Endpoints

| Method | Path       | Description                           |
|--------|------------|---------------------------------------|
| GET    | `/health`  | Health check & model version          |
| POST   | `/analyze` | Analyze submission files or raw text  |

### POST `/analyze`

**Content-Type:** `multipart/form-data`

| Parameter  | Type           | Required | Description                      |
|------------|----------------|----------|----------------------------------|
| `files`    | File upload(s) | No*      | Student submission files          |
| `raw_text` | string         | No*      | Raw code or text to analyze       |

*At least one of `files` or `raw_text` must be provided.

**Supported file types:**
- Source code: `.py`, `.js`, `.ts`, `.java`, `.cpp`, `.c`, `.cs`, `.go`, `.rs`, `.sql`, `.html`, `.css`, `.r`, `.rb`, `.swift`, `.kt`, `.scala`
- Documents: `.txt`, `.md`, `.pdf`, `.json`, `.yaml`, `.yml`, `.xml`, `.csv`
- Notebooks: `.ipynb` (Jupyter)

---

## Example Response

### ✅ SUCCESS

```json
{
  "status": "SUCCESS",
  "model_version": "skillbridge-gemini-1.5-pro-v1",
  "total_skills_detected": 2,
  "overall_confidence": 0.93,
  "skills": [
    {
      "skill": "Python",
      "confidence": 0.95,
      "evidence": "def clean_dataset(df): return df.dropna().apply(lambda x: x.strip())",
      "evidence_strength": 0.92,
      "complexity": 0.65,
      "quality": 0.88
    },
    {
      "skill": "Pandas",
      "confidence": 0.91,
      "evidence": "import pandas as pd; df = pd.read_csv('student_data.csv')",
      "evidence_strength": 0.9,
      "complexity": 0.5,
      "quality": 0.85
    }
  ],
  "review_notes": null
}
```

### ⚠️ NEEDS_REVIEW (low confidence)

```json
{
  "status": "NEEDS_REVIEW",
  "model_version": "skillbridge-gemini-1.5-pro-v1",
  "total_skills_detected": 1,
  "overall_confidence": 0.52,
  "skills": [
    {
      "skill": "SQL",
      "confidence": 0.52,
      "evidence": "-- incomplete query select * from users",
      "evidence_strength": 0.4,
      "complexity": 0.2,
      "quality": 0.3
    }
  ],
  "review_notes": "One or more detected skills fell below the confidence threshold of 0.65."
}
```

---

## Integration Flow

```
[Student Upload]
       │
       ▼
[Main Backend Service]
       │  (HTTP POST /analyze with files/code)
       ▼
[This AI Module]  ◄── You are here (Friend 2)
       │  (Returns structured JSON)
       ▼
[Main Backend Service]
       ├──► Applies scoring formula & points
       ├──► Unlocks badges
       └──► Updates database
```

**This module does NOT:**
- Handle database updates
- Calculate points or aggregations
- Manage badges or user profiles

It **only** analyzes submissions and returns structured skill-detection results.

---

## Configuration

All settings are loaded from `.env`:

| Variable               | Default                          | Description                         |
|------------------------|----------------------------------|-------------------------------------|
| `GEMINI_API_KEY`       | *(required)*                     | Google Gemini API key               |
| `CONFIDENCE_THRESHOLD` | `0.65`                           | Below this → NEEDS_REVIEW           |
| `MODEL_VERSION`        | `skillbridge-gemini-1.5-pro-v1`  | Version tag in responses            |
