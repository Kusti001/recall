## Recall

A fullstack flashcard application built around spaced repetition and active recall.

**Planned:**
- Flexible OAuth2 setup with support for adding new providers
- Learning statistics and progress analytics
- More advanced card fields and customization options

**Stack:**

- Backend: FastAPI, SQLAlchemy, PostgreSQL
- Frontend: React, TypeScript, Vite, Tailwind CSS, shadcn/ui
- Authentication: JWT, OAuth2
- Infrastructure: Docker, Docker Compose, Nginx

## Table of Contents
- [Getting Started](#getting-started)
  - [Clone and install dependencies](#clone-and-install-dependencies)
  - [Configure environment variables](#configure-environment-variables)
  - [Run](#run)
- [Project Structure](#project-structure)
## Getting Started

### Clone and install dependencies

```bash
git clone https://github.com/kusti001/recall.git
cd recall
```

```bash
# Python dependencies
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

```bash
# Node dependencies
cd frontend
npm install
```

### Configure environment variables

The project uses separate environment configurations for development and production.

**Development**

Development environment files:
**backend/.env.dev**
**frontend/.env.development**
**.env.dev**

**Production**

Production uses a single environment file:
**frontend/.env.production** for frontend build
**`.env.prod`:** loaded by Docker Compose



### Run
In separate terminals:
```bash
# Database
docker compose -f docker-compose.dev.yml up -d

# Backend
cd backend
uvicorn app.main:app --reload

# Frontend
cd frontend
npm run dev
```

**Run in production:**

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

## Project Structure

```
.
├── backend/
│   └── app/
│       ├── api/                       # Endpoints
│       ├── core/                      # Config, JWT, OAuth2 clients
│       ├── db/                        # Engine, session, migrations
│       ├── models/                    # Business entities
│       ├── services/                  # Business logic
│       ├── schemas/                   # Pydantic schemas / API contracts
│       ├── repositories/              # Database access layer
│       └── main.py                    # App entrypoint
├── frontend/
│   └── src/
│       ├── pages/                     # LoginPage, AuthCallbackPage, etc.
│       ├── shared/api/                # API client + all request functions
│       └── App.tsx                    # Router config
├── docker-compose.dev.yml
├── docker-compose.prod.yml
└── README.md
```
