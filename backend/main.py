from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine, Base
from app.routes import auth, projects, tasks
import app.models.project
import app.models.task

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Team Task Manager API",
    description="A full-stack team task management application",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api")
app.include_router(projects.router, prefix="/api")
app.include_router(tasks.router, prefix="/api")

@app.get("/")
def root():
    return {"message": "Team Task Manager API is running!"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}