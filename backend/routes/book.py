from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models.book import Book as BookModel
from schemas.book import Book, BookCreate

router = APIRouter()

# Skapa tabeller
BookModel.metadata.create_all(bind=engine)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# GET /books/
@router.get("/", response_model=list[Book])
def get_books(db: Session = Depends(get_db)):
    return db.query(BookModel).all()

# POST /books/
@router.post("/", response_model=Book)
def create_book(book: BookCreate, db: Session = Depends(get_db)):
    db_book = BookModel(title=book.title, author=book.author)
    db.add(db_book)
    db.commit()
    db.refresh(db_book)
    return db_book