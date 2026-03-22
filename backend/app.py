from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.book import router as book_router

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(book_router, prefix="/books")