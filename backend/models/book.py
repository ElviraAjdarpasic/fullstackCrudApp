from fastapi import APIRouter
from schemas.book import Book
from models.book import Book as BookModel

router = APIRouter()

books_db = []

# Hämta alla
@router.get("", include_in_schema=False)  # tom string för att hantera både /books och /books/
@router.get("/")
def get_books():
    return books_db

# Hämta en bok
@router.get("/{book_id}")
def get_book(book_id: int):
    for book in books_db:
        if book["id"] == book_id:
            return book
    return {"error": "Book not found"}

# Skapa ny bok
@router.post("/")
def create_book(book: Book):
    new_id = len(books_db) + 1
    book_dict = {"id": new_id, "title": book.title, "author": book.author}
    books_db.append(book_dict)
    return book_dict