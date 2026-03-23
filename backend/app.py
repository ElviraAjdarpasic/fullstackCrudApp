from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.todo import router as todo_router

app = FastAPI()

# CORS (låter frontend prata med backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(todo_router, prefix="/todos")