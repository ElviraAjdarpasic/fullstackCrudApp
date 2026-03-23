from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models.book import Book as BookModel
from schemas.book import Book, BookCreate

router = APIRouter()

# Skapa tabell
BookModel.metadata.create_all(bind=engine)

# Dependency (databas-connection)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 🔹 GET alla böcker
@router.get("/", response_model=list[Book])
def get_books(db: Session = Depends(get_db)):
    return db.query(BookModel).all()

# 🔹 POST skapa bok
@router.post("/", response_model=Book)
def create_book(book: BookCreate, db: Session = Depends(get_db)):
    db_book = BookModel(title=book.title, author=book.author)
    db.add(db_book)
    db.commit()
    db.refresh(db_book)
    return db_book

# 🔹 DELETE ta bort bok
@router.delete("/{book_id}")
def delete_book(book_id: int, db: Session = Depends(get_db)):
    book = db.query(BookModel).filter(BookModel.id == book_id).first()
    
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    
    db.delete(book)
    db.commit()
    
    return {"message": "Book deleted"}