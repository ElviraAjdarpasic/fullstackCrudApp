from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from database import SessionLocal, engine
from models.todo import Base, Todo, TodoList
from schemas.todo import TodoCreate, TodoListCreate, TodoList as TodoListSchema

Base.metadata.create_all(bind=engine)

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/", response_model=List[TodoListSchema])
def read_todolists(db: Session = Depends(get_db)):
    return db.query(TodoList).order_by(TodoList.id.desc()).all()


@router.post("/", response_model=TodoListSchema)
def create_todolist(todo_list: TodoListCreate, db: Session = Depends(get_db)):
    title = todo_list.title.strip()
    if title:
        title = title[0].upper() + title[1:].lower()
    db_list = TodoList(title=title)
    db.add(db_list)
    db.commit()
    db.refresh(db_list)
    return db_list


@router.post("/{list_id}/todos", response_model=TodoListSchema)
def create_todo_for_list(list_id: int, todo: TodoCreate, db: Session = Depends(get_db)):
    db_list = db.query(TodoList).filter(TodoList.id == list_id).first()
    if not db_list:
        raise HTTPException(status_code=404, detail="Listan hittades inte")
    
    content = todo.content.strip()
    if content:
        content = content[0].upper() + content[1:].lower()
    
    db_todo = Todo(content=content, list_id=list_id, completed=False)
    db.add(db_todo)
    db.commit()
    db.refresh(db_list)
    return db_list


@router.delete("/{list_id}", response_model=dict)
def delete_todolist(list_id: int, db: Session = Depends(get_db)):
    db_list = db.query(TodoList).filter(TodoList.id == list_id).first()
    if not db_list:
        raise HTTPException(status_code=404, detail="Listan hittades inte")
    
    db.delete(db_list)
    db.commit()
    return {"message": "Lista borttagen"}


@router.delete("/{list_id}/todos/{todo_id}", response_model=TodoListSchema)
def delete_todo(list_id: int, todo_id: int, db: Session = Depends(get_db)):
    todo = db.query(Todo).filter(Todo.id == todo_id, Todo.list_id == list_id).first()
    if not todo:
        raise HTTPException(status_code=404, detail="Todo hittades inte")
    
    db.delete(todo)
    db.commit()
    
    todolist = db.query(TodoList).filter(TodoList.id == list_id).first()
    if todolist:
        db.refresh(todolist)
        return todolist
    raise HTTPException(status_code=404, detail="Lista hittades inte")


@router.patch("/{list_id}/todos/{todo_id}/complete", response_model=TodoListSchema)
def toggle_complete(list_id: int, todo_id: int, db: Session = Depends(get_db)):
    todo = db.query(Todo).filter(Todo.id == todo_id, Todo.list_id == list_id).first()
    if not todo:
        raise HTTPException(status_code=404, detail="Todo hittades inte")
    
    todo.completed = not todo.completed
    db.commit()
    
    todolist = db.query(TodoList).filter(TodoList.id == list_id).first()
    db.refresh(todolist)
    return todolist