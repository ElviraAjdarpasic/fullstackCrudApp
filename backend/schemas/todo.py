from pydantic import BaseModel
from typing import List

# Scheman för Todo
class TodoBase(BaseModel):
    content: str

class TodoCreate(TodoBase):
    pass

class Todo(TodoBase):
    id: int
    list_id: int

    class Config:
        from_attributes = True  # orm_mode i Pydantic v2

# Scheman för TodoList
class TodoListBase(BaseModel):
    title: str

class TodoListCreate(TodoListBase):
    pass

class TodoList(TodoListBase):
    id: int
    todos: List[Todo] = []  # tom lista som default

    class Config:
        from_attributes = True