import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [todoLists, setTodoLists] = useState([]);
  const [newListTitle, setNewListTitle] = useState("");
  const [newTodoText, setNewTodoText] = useState({});

  const fetchTodoLists = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/todolists/");
      if (!res.ok) throw new Error(`Hämtning misslyckades: ${res.status}`);
      const data = await res.json();
      setTodoLists(data);
    } catch (err) {
      console.error("Fel vid hämtning av listor:", err);
    }
  };

  useEffect(() => {
    fetchTodoLists();
  }, []);

  const addTodoList = async () => {
    if (!newListTitle.trim()) return;
    try {
      const res = await fetch("http://127.0.0.1:8000/todolists/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newListTitle }),
      });
      if (!res.ok) throw new Error("Kunde inte skapa lista");
      setNewListTitle("");
      fetchTodoLists();
    } catch (err) {
      console.error(err);
    }
  };

  const addTodo = async (listId) => {
    const text = newTodoText[listId]?.trim();
    if (!text) return;

    try {
      const res = await fetch(`http://127.0.0.1:8000/todolists/${listId}/todos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text }),
      });
      if (!res.ok) throw new Error("Kunde inte lägga till todo");
      setNewTodoText({ ...newTodoText, [listId]: "" });
      fetchTodoLists();
    } catch (err) {
      console.error("Fel vid lägg till todo:", err);
    }
  };

  const deleteTodoList = async (listId) => {
    if (!window.confirm("Ta bort hela listan?")) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/todolists/${listId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Kunde inte ta bort lista");
      fetchTodoLists();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTodo = async (listId, todoId) => {
    if (!window.confirm("Ta bort todo?")) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/todolists/${listId}/todos/${todoId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Kunde inte ta bort todo");
      fetchTodoLists();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleComplete = async (listId, todoId) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/todolists/${listId}/todos/${todoId}/complete`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error("Kunde inte uppdatera status");
      fetchTodoLists();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="app">
      <h1>Min Todo Lista</h1>

      <div className="new-list">
        <input
          type="text"
          placeholder="Ny rubrik till todolistan..."
          value={newListTitle}
          onChange={(e) => setNewListTitle(e.target.value)}
        />
        <button onClick={addTodoList}>Lägg till lista</button>
      </div>

      {todoLists.map((list) => (
        <div className="todolist" key={list.id}>
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            marginBottom: "24px"
          }}>
            <h2 style={{ margin: 0, textAlign: "center", flex: 1 }}>
              {list.title}
            </h2>
            <button
              onClick={() => deleteTodoList(list.id)}
              className="delete-list-btn"
            >
              Ta bort lista
            </button>
          </div>

          <div className="todos">
            {list.todos.map((todo) => (
              <div 
                className={`todo ${todo.completed ? "completed" : ""}`}
                key={todo.id}
              >
                <span>{todo.content}</span>
                <div>
                  <button
                    className="complete-btn"
                    onClick={() => toggleComplete(list.id, todo.id)}
                  >
                    ✓
                  </button>
                  <button
                    onClick={() => deleteTodo(list.id, todo.id)}
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="new-todo">
            <input
              type="text"
              placeholder="Ny uppgift..."
              value={newTodoText[list.id] || ""}
              onChange={(e) =>
                setNewTodoText({ ...newTodoText, [list.id]: e.target.value })
              }
            />
            <button onClick={() => addTodo(list.id)}>Lägg till</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;