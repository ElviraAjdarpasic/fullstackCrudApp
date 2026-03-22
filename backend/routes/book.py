from fastapi import APIRouter, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models.book import Book as BookModel  # SQLAlchemy-modellen
from schemas.book import Book as BookSchema  # Pydantic-schemat

# Skapa tabeller i databasen om de inte finns
BookModel.metadata.create_all(bind=engine)

router = APIRouter()

# Dependency för DB-session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Hämta alla böcker
@router.get("/")
def get_books(db: Session = next(get_db())):
    books = db.query(BookModel).all()
    return books

# Hämta en bok
@router.get("/{book_id}")
def get_book(book_id: int, db: Session = next(get_db())):
    book = db.query(BookModel).filter(BookModel.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return book

# Skapa en ny bok
@router.post("/")
def create_book(book: BookSchema, db: Session = next(get_db())):
    db_book = BookModel(title=book.title, author=book.author)
    db.add(db_book)
    db.commit()
    db.refresh(db_book)
    return db_book

# Uppdatera en bok
@router.put("/{book_id}")
def update_book(book_id: int, book: BookSchema, db: Session = next(get_db())):
    db_book = db.query(BookModel).filter(BookModel.id == book_id).first()
    if not db_book:
        raise HTTPException(status_code=404, detail="Book not found")
    db_book.title = book.title
    db_book.author = book.author
    db.commit()
    db.refresh(db_book)
    return db_book

# Ta bort en bok
@router.delete("/{book_id}")
def delete_book(book_id: int, db: Session = next(get_db())):
    db_book = db.query(BookModel).filter(BookModel.id == book_id).first()
    if not db_book:
        raise HTTPException(status_code=404, detail="Book not found")
    db.delete(db_book)
    db.commit()
    return {"detail": "Book deleted"}