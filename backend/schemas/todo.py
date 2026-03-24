from pydantic import BaseModel
from typing import List

# Scheman för enskild Todo
class TodoBase(BaseModel):
    content: str

class TodoCreate(TodoBase):
    pass

# Uppdaterad Todo med completed-fält
class Todo(TodoBase):
    id: int
    list_id: int
    completed: bool = False          

    class Config:
        from_attributes = True     


# Scheman för TodoList
class TodoListBase(BaseModel):
    title: str

class TodoListCreate(TodoListBase):
    pass

class TodoList(TodoListBase):
    id: int
    todos: List[Todo] = []          

    class Config:
        from_attributes = True