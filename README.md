# AI Architecture Workbench

An AI-powered system architecture generator that takes a plain-English description of your application requirements and returns a complete architectural design — including the recommended pattern, component breakdown with rationale, component connections, and a rendered diagram.

---

## Table of Contents

- [How It Works](#how-it-works)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Setup](#setup)
  - [Backend (Flask API)](#backend-flask-api)
  - [Frontend (React)](#frontend-react)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Usage](#usage)
- [Features](#features)

---

## How It Works

```
User Prompt
    │
    ▼
React Frontend  ──POST /api/user/input──►  Flask Backend
                                                │
                                     ArchitectureAnalyzer
                                                │
                                         LLMService (Azure OpenAI)
                                         • Sends prompt + system instructions
                                         • Receives structured JSON:
                                           - pattern & rationale
                                           - components list
                                           - connections list
                                           - D2 diagram code
                                                │
                                        DiagramGenerator
                                         • Calls D2 CLI with generated code
                                         • Retries automatically if icon
                                           fetch fails (strips bad URLs)
                                         • Returns base64-encoded image
                                                │
                                    ◄── JSON response ──
    │
    ▼
Result View
 • Architectural pattern + rationale
 • Component cards (name, type, description, rationale)
 • Connection list
 • Rendered SVG/PNG/PDF diagram
 • D2 source code viewer
```

1. **User submits a prompt** — e.g. *"I need a real-time inventory management system for a small shop"*.
2. **Backend analyzes requirements** via Azure OpenAI (GPT-4o by default). A carefully crafted system prompt instructs the model to return a structured JSON object containing the chosen architecture pattern, component list, connections, and [D2](https://d2lang.com) diagram code.
3. **Diagram is rendered** by invoking the D2 CLI locally. If remote icon URLs fail (403 / network error), the generator automatically retries — first stripping only the failing URLs, then all remote icons — so a diagram is always produced.
4. **Response is returned** to the frontend as JSON. The frontend displays pattern information, interactive component cards, connection list, and the rendered diagram with a toggleable D2 code viewer.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, Tailwind CSS v4, Axios, react-hot-toast, lucide-react |
| Backend | Python 3, Flask 3, Flask-CORS, python-dotenv |
| AI / LLM | Azure OpenAI (GPT-4o) via `openai` SDK |
| Diagram | [D2](https://d2lang.com) CLI (Terrastruct icons, Dagre layout) |

---

## Prerequisites

| Requirement | Notes |
|-------------|-------|
| **Python 3.10+** | For the Flask backend |
| **Node.js 18+** | For the React frontend |
| **D2 CLI** | For diagram rendering — [install instructions](https://d2lang.com/tour/install) |
| **Azure OpenAI resource** | Requires API key, endpoint, and a deployed model |

### Install D2

```bash
# macOS / Linux (using the install script)
curl -fsSL https://d2lang.com/install.sh | sh

# macOS (Homebrew)
brew install d2

# Windows (winget)
winget install Terrastruct.D2
```

> **Note:** D2 is required for diagram rendering. If D2 is not installed, the API will still return the architecture analysis and D2 source code — only the rendered image will be unavailable.

---

## Project Structure

```
LLL-Based-System-Architecture-Generator/
├── BE/                         # Flask backend
│   ├── app.py                  # Application entry point, Flask setup
│   ├── api_routes.py           # REST API endpoint definitions
│   ├── architecture_analyzer.py# Orchestrates LLM analysis
│   ├── llm_service.py          # Azure OpenAI integration
│   ├── diagram_generator.py    # D2 CLI wrapper & retry logic
│   ├── config.py               # Centralised configuration (env vars)
│   ├── utils.py                # Shared utility helpers
│   └── requirements.txt        # Python dependencies
│
└── FE/                         # React frontend
    ├── src/
    │   ├── App.jsx             # Root component (state, routing logic)
    │   ├── components/
    │   │   ├── InputForm.jsx   # Prompt input form
    │   │   ├── ResultView.jsx  # Architecture result layout
    │   │   ├── ComponentCard.jsx # Individual component display
    │   │   ├── DiagramView.jsx # Diagram renderer + D2 code viewer
    │   │   ├── HistoryPanel.jsx# Session history sidebar
    │   │   └── SkeletonLoader.jsx # Loading placeholder
    │   ├── services/
    │   │   └── api.js          # Axios API client
    │   ├── hooks/
    │   │   └── useDarkMode.js  # Dark/light mode hook
    │   └── utils/
    │       ├── storage.js      # localStorage history helpers
    │       └── time.js         # Time formatting utilities
    ├── package.json
    └── vite.config.js
```

---

## Setup

### Backend (Flask API)

**1. Navigate to the backend directory**

```bash
cd BE
```

**2. Create and activate a virtual environment**

```bash
python -m venv venv

# Linux / macOS
source venv/bin/activate

# Windows
venv\Scripts\activate
```

**3. Install dependencies**

```bash
pip install -r requirements.txt
```

**4. Create the environment file**

Copy the example below and save it as `BE/.env`:

```dotenv
# Flask
FLASK_ENV=development
FLASK_HOST=0.0.0.0
FLASK_PORT=5000
FLASK_DEBUG=True

# Azure OpenAI (required)
LLM_PROVIDER=azure
AZURE_OPENAI_API_KEY=your_azure_openai_api_key_here
AZURE_OPENAI_ENDPOINT=https://your-resource-name.openai.azure.com/
AZURE_OPENAI_API_VERSION=2024-12-01-preview
AZURE_DEPLOYMENT_NAME=gpt-4o

# LLM behaviour (optional)
LLM_MODEL=gpt-4o
LLM_TEMPERATURE=0.7
LLM_MAX_TOKENS=2000

# Diagram (optional)
DIAGRAM_FORMAT=svg
DIAGRAM_DPI=300
```

See [Environment Variables](#environment-variables) for the full reference.

**5. Start the backend server**

```bash
python app.py
```

The API will be available at `http://localhost:5000`.

---

### Frontend (React)

**1. Navigate to the frontend directory**

```bash
cd FE
```

**2. Install dependencies**

```bash
npm install
```

**3. Start the development server**

```bash
npm run dev
```

The app will be available at `http://localhost:5173` (default Vite port).

> The frontend expects the backend to be running at `http://localhost:5000`. This base URL is configured in `FE/src/services/api.js`.

**Other available scripts:**

```bash
npm run build    # Production build (output: dist/)
npm run preview  # Preview production build locally
npm run lint     # Run ESLint
```

---

## Environment Variables

All backend configuration is loaded from `BE/.env`. The table below lists every variable.

### Flask

| Variable | Default | Description |
|----------|---------|-------------|
| `FLASK_ENV` | `production` | `development` or `production` |
| `FLASK_HOST` | `0.0.0.0` | Host to bind the server to |
| `FLASK_PORT` | `5000` | Port the server listens on |
| `FLASK_DEBUG` | `False` | Enable Flask debug mode |

### LLM Provider

| Variable | Default | Description |
|----------|---------|-------------|
| `LLM_PROVIDER` | `azure` | LLM provider (currently only `azure` is supported) |
| `LLM_MODEL` | `gpt-4o` | Model name |
| `LLM_TEMPERATURE` | `0.7` | Sampling temperature (0–1) |
| `LLM_MAX_TOKENS` | `2000` | Maximum tokens in the LLM response |

### Azure OpenAI *(required when `LLM_PROVIDER=azure`)*

| Variable | Default | Description |
|----------|---------|-------------|
| `AZURE_OPENAI_API_KEY` | — | **Required.** Your Azure OpenAI API key |
| `AZURE_OPENAI_ENDPOINT` | — | **Required.** Your Azure OpenAI endpoint URL |
| `AZURE_OPENAI_API_VERSION` | `2024-12-01-preview` | API version |
| `AZURE_DEPLOYMENT_NAME` | `gpt-4o` | Name of your deployed model in Azure |

### Diagram Generation

| Variable | Default | Description |
|----------|---------|-------------|
| `DIAGRAM_FORMAT` | `png` | Default output format (`svg`, `png`, `pdf`) |
| `DIAGRAM_DPI` | `300` | DPI for PNG output |
| `DIAGRAM_STYLE` | `default` | D2 theme style |

### Logging

| Variable | Default | Description |
|----------|---------|-------------|
| `LOG_LEVEL` | `INFO` | Log level (`DEBUG`, `INFO`, `WARNING`, `ERROR`) |
| `LOG_FILE_PATH` | `logs/app.log` | Path to the log file |
| `LOG_FILE_MAX_BYTES` | `10485760` | Max log file size before rotation (10 MB) |
| `LOG_FILE_BACKUP_COUNT` | `5` | Number of rotated log files to keep |

---

## API Reference

All endpoints are prefixed with `/api`.

### `POST /api/user/input`

Analyze requirements and generate a full architecture with diagram.

**Request body**

```json
{
  "user_prompt": "I want to build a real-time inventory management system",
  "diagram_format": "svg"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `user_prompt` | string | ✅ | Plain-English description of your system requirements |
| `diagram_format` | string | ❌ | `svg` (default), `png`, or `pdf` |

**Response body**

```json
{
  "success": true,
  "data": {
    "architectural_pattern": "microservices",
    "pattern_rationale": "Explanation of why microservices was chosen...",
    "architectural_components": [
      {
        "name": "API Gateway",
        "type": "gateway",
        "description": "Entry point for all API requests",
        "responsibility": "Routing, auth, rate limiting",
        "rationale": "Centralises cross-cutting concerns..."
      }
    ],
    "connections": [
      {
        "from": "Web UI",
        "to": "API Gateway",
        "label": "HTTPS"
      }
    ],
    "diagram": {
      "image": "<base64-encoded image>",
      "format": "svg",
      "mime_type": "image/svg+xml",
      "d2_code": "direction: right\n..."
    }
  }
}
```

---

### `POST /api/diagram/render`

Render an existing D2 code string into an image.

**Request body**

```json
{
  "d2_code": "direction: right\nusers -> api: HTTPS",
  "format": "svg"
}
```

**Response body**

```json
{
  "success": true,
  "data": {
    "image": "<base64-encoded image>",
    "format": "svg",
    "mime_type": "image/svg+xml"
  }
}
```

---

### `POST /api/diagram/validate`

Validate D2 code syntax without rendering.

**Request body**

```json
{
  "d2_code": "direction: right\nusers -> api: HTTPS"
}
```

**Response body**

```json
{
  "success": true,
  "data": {
    "valid": true,
    "error": null
  }
}
```

---

### `GET /api/health/d2`

Check whether the D2 CLI is installed and available on the server.

**Response body**

```json
{
  "success": true,
  "data": {
    "d2_available": true,
    "d2_path": "/usr/local/bin/d2"
  }
}
```

---

## Usage

1. Open the app in your browser (`http://localhost:5173`).
2. Type a description of the system you want to design, for example:
   - *"A real-time chat application that needs to handle 10,000 concurrent users"*
   - *"An e-commerce platform with product catalog, cart, payments, and order tracking"*
   - *"A serverless data pipeline that ingests IoT sensor data and generates alerts"*
3. Click **Generate Architecture**.
4. The result view shows:
   - **Pattern** — the recommended architectural style (e.g. microservices, event-driven) with a full rationale.
   - **Components** — each component with its type, description, responsibilities, and why it was chosen.
   - **Connections** — how components communicate.
   - **Diagram** — a rendered SVG/PNG diagram. The D2 source code can be toggled and copied.
5. Use the **filter bar** to search across component names, types, and descriptions.
6. Previous results are stored in **browser local storage** and accessible from the history panel.

---

## Features

- 🤖 **AI-driven analysis** — GPT-4o generates a thoughtful architecture design tailored to your requirements.
- 🏛️ **10+ supported patterns** — microservices, monolithic, serverless, event-driven, layered, CQRS, hexagonal, and more.
- 📐 **Auto-rendered diagrams** — D2 diagrams with AWS/dev icons are rendered automatically (SVG, PNG, PDF).
- 🔄 **Resilient icon handling** — if icon CDN requests fail, the generator retries without failing icons so a diagram is always produced.
- 🌙 **Dark / light mode** — system preference detection with manual toggle.
- 🕐 **Session history** — past results are saved in local storage and can be restored.
- 🔍 **Component search** — filter the generated component list in real time.
- 📋 **D2 code viewer** — copy the raw D2 source to customise diagrams further.
