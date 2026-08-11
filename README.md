## Recall
A fullstack flashcard application built around spaced repetition and active recall.

**Features**
- User registration and authentication based authorization
- Deck creation and management
- Flashcard creation and management
- Front/back card structure with descriptions
- Spaced repetition scheduling
- Review sessions with automatic card scheduling
- Card statuses and mastery tracking
- Review history and statistics
- Success streak tracking
- Deck progress and review overview
- Responsive web interface

**Planned:**
- Better statistics and progress analytics
- More advanced card fields and customization options
- Smart card generation

**Stack:**
- Backend: FastAPI, SQLAlchemy, PostgreSQL
- Frontend: React, TypeScript, Vite, Tailwind CSS, shadcn/ui
- Authentication: JWT, OAuth2
- Infrastructure: Docker, Docker Compose, Nginx

## Getting Started
### Requirements
Before you start, make sure you have the following installed:
- Git: to clone the repository
- Python 3.11+: for the backend
- Node.js 20+ and npm: for the frontend
- Docker and Docker Compose: for running the PostgreSQL database and/or the full production stack

You can check the installed versions:
```
git --version
python --version
node --version
npm --version
docker --version
docker compose version
```

### 1. Clone the repository

```bash
git clone https://github.com/kusti001/recall.git
cd recall
```
### 2. Configure environment variables
The project uses separate environment files for development and production.

**Development**

Check the following files:
```
.env.dev                  (Ready to use out of the box)
backend/.env.dev          (Ready to use out of the box)
frontend/.env.development (Ready to use out of the box)
```
Make sure they contain the required environment variables. Use the example environment files provided in the repository, if available.

**Production**

Production uses:
```
.env.prod                (Create from .env.prod.example)
frontend/.env.production (Ready to use out of the box)
```
### 3. Install backend dependencies
Create and activate a Python virtual environment:
```bash
cd backend
python -m venv .venv
```
Activate it:

Linux / macOS:
```bash
source .venv/bin/activate
```
Windows:
```bash
.venv\Scripts\Activate.ps1
```

Then install the dependencies:
```bash
pip install -r requirements.txt
```
### 4. Install frontend dependencies
Open another terminal and run:
```bash
cd frontend
npm install
```
### Running locally in development
The development setup consists of three parts:
- PostgreSQL database: running in Docker
- FastAPI backend: running locally
- React frontend: running locally

*You will need three terminals.*

**Terminal 1 - Database**

From the project root:
```bash
docker compose -f docker-compose.dev.yml up -d
```
This starts the development database.

You can check that the containers are running:
```bash
docker compose -f docker-compose.dev.yml ps
```
**Terminal 2 - Backend**
```bash
cd backend
alembic upgrade head
uvicorn app.main:app --reload
```
The backend should now be available at:
http://localhost:8000

> [!IMPORTANT]  
> Run alembic upgrade head after every git pull that includes new database migrations.

**Terminal 3 - Frontend**
```bash
cd frontend
npm run dev
```
The terminal will show the URL where the frontend is available, usually:
http://localhost:5173
Open that URL in your browser.
### Running in production
Make sure Docker and Docker Compose are installed and that the production environment files are configured.

From the project root:
```bash
docker compose -f docker-compose.prod.yml up -d --build
```
After the containers have started, run the database migrations:
```bash
docker compose -f docker-compose.prod.yml exec api alembic upgrade head
```
The application should now be available at the configured production port/domain.

> [!IMPORTANT]  
> Run alembic upgrade head after every git pull that includes new database migrations.

Useful Docker commands

Check the status of the containers:
```bash
docker compose -f docker-compose.prod.yml ps
```
View logs:
```bash
docker compose -f docker-compose.prod.yml logs -f
```
Stop the application:
```bash
docker compose -f docker-compose.prod.yml down
```
## Project Structure
The project is split into a FastAPI backend and a React frontend.
```
├── backend/
│   └── app/
│       ├── alembic/                   # Alembic migrations
│       ├── api/                       # HTTP endpoints and route handlers
│       ├── core/                      # Application configuration
│       ├── db/                        # Database engine and sessions
│       ├── models/                    # SQLAlchemy database models
│       ├── services/                  # Business logic
│       ├── repositories/              # Database queries and data access
│       ├── schemas/                   # Pydantic request/response schemas
│       ├── repositories/              # Database access layer
│       └── main.py                    # FastAPI application entrypoint
├── frontend/
│   └── src/
│       ├── pages/                     # Application pages
│       ├── shared/
│       │   └── api/                   # Generated/centralized API client and requests
│       ├── components/                # Reusable UI components
│       └── App.tsx                    # Application/router configuration
├── docker-compose.dev.yml             # Development infrastructure
├── docker-compose.prod.yml            # Production stack
├── .env.dev                           # Development environment
├── .env.prod                          # Production environment
└── README.md
```
The main request flow is:
```
HTTP request
  ↓
api
  ↓
services
  ↓
repositories
  ↓
database
```
