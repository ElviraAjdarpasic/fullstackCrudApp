from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models, schemas

# Skapa tabeller
models.Base.metadata.create_all(bind=engine)

router = APIRouter()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Sections
@router.get("/sections/", response_model=list[schemas.Section])
def get_sections(db: Session = Depends(get_db)):
    return db.query(models.Section).all()

@router.post("/sections/", response_model=schemas.Section)
def create_section(section: schemas.SectionCreate, db: Session = Depends(get_db)):
    db_section = models.Section(title=section.title)
    db.add(db_section)
    db.commit()
    db.refresh(db_section)
    return db_section

# Todos
@router.post("/sections/{section_id}/todos/", response_model=schemas.Todo)
def create_todo(section_id: int, todo: schemas.TodoCreate, db: Session = Depends(get_db)):
    db_section = db.query(models.Section).filter(models.Section.id == section_id).first()
    if not db_section:
        raise HTTPException(status_code=404, detail="Section not found")
    db_todo = models.Todo(content=todo.content, section_id=section_id)
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    return db_todo

@router.delete("/todos/{todo_id}")
def delete_todo(todo_id: int, db: Session = Depends(get_db)):
    db_todo = db.query(models.Todo).filter(models.Todo.id == todo_id).first()
    if not db_todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    db.delete(db_todo)
    db.commit()
    return {"detail": "Todo deleted"}