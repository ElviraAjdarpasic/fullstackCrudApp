from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.todo import router as todo_router

app = FastAPI(title="Todo Fullstack App")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(todo_router, prefix="/todolists", tags=["todolists"])

@app.get("/")
def root():
    return {
        "message": "Todo API är igång",
        "docs": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}