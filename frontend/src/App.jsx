import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [todoLists, setTodoLists] = useState([]);
  const [newListTitle, setNewListTitle] = useState("");
  const [newTodoText, setNewTodoText] = useState({});
  const [editingTodo, setEditingTodo] = useState(null);
  const [editingList, setEditingList] = useState(null);

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

  const updateTodo = async (listId, todoId, newContent) => {
    if (!newContent?.trim()) {
      setEditingTodo(null);
      return;
    }

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/todolists/${listId}/todos/${todoId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: newContent.trim() }),
        }
      );

      if (!res.ok) throw new Error("Kunde inte uppdatera todo");
      
      setEditingTodo(null);
      fetchTodoLists();
    } catch (err) {
      console.error("Fel vid uppdatering av todo:", err);
      alert("Något gick fel när todo skulle uppdateras");
    }
  };

  const updateListTitle = async (listId, newTitle) => {
    if (!newTitle?.trim()) {
      setEditingList(null);
      return;
    }

    try {
      const res = await fetch(`http://127.0.0.1:8000/todolists/${listId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle.trim() }),
      });

      if (!res.ok) throw new Error("Kunde inte uppdatera rubrik");
      
      setEditingList(null);
      fetchTodoLists();
    } catch (err) {
      console.error("Fel vid uppdatering av rubrik:", err);
      alert("Något gick fel när rubriken skulle uppdateras");
    }
  };

  const deleteTodoList = async (listId) => {
    if (!window.confirm("Ta bort hela listan?")) return;
    try {
      await fetch(`http://127.0.0.1:8000/todolists/${listId}`, { method: "DELETE" });
      fetchTodoLists();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTodo = async (listId, todoId) => {
    if (!window.confirm("Ta bort todo?")) return;
    try {
      await fetch(`http://127.0.0.1:8000/todolists/${listId}/todos/${todoId}`, { method: "DELETE" });
      fetchTodoLists();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleComplete = async (listId, todoId) => {
    try {
      await fetch(`http://127.0.0.1:8000/todolists/${listId}/todos/${todoId}/complete`, {
        method: "PATCH",
      });
      fetchTodoLists();
    } catch (err) {
      console.error(err);
    }
  };

  const handleNewTodoKeyDown = (e, listId) => {
    if (e.key === "Enter") {
      addTodo(listId);
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
            {editingList === list.id ? (
              <input
                type="text"
                defaultValue={list.title}
                autoFocus
                onBlur={(e) => updateListTitle(list.id, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") updateListTitle(list.id, e.target.value);
                  if (e.key === "Escape") setEditingList(null);
                }}
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  fontSize: "1.75rem",
                  fontWeight: 600,
                  border: "2px solid #d81b60",
                  borderRadius: "8px",
                  marginRight: "12px"
                }}
              />
            ) : (
              <h2 style={{ margin: 0, textAlign: "center", flex: 1 }}>
                {list.title}
              </h2>
            )}

            <div style={{ display: "flex", gap: "8px" }}>
              {editingList !== list.id && (
                <button
                  onClick={() => setEditingList(list.id)}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "1.6rem",
                    color: "#d81b60",
                    cursor: "pointer",
                  }}
                >
                  ✏️
                </button>
              )}

              <button
                onClick={() => deleteTodoList(list.id)}
                className="delete-list-btn"
              >
                Ta bort lista
              </button>
            </div>
          </div>

          <div className="todos">
            {list.todos.map((todo) => (
              <div 
                className={`todo ${todo.completed ? "completed" : ""}`}
                key={todo.id}
              >
                {editingTodo?.listId === list.id && editingTodo?.todoId === todo.id ? (
                  <input
                    type="text"
                    defaultValue={todo.content}
                    autoFocus
                    onBlur={(e) => updateTodo(list.id, todo.id, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") updateTodo(list.id, todo.id, e.target.value);
                      if (e.key === "Escape") setEditingTodo(null);
                    }}
                    style={{
                      flex: 1,
                      padding: "8px 12px",
                      border: "2px solid #d81b60",
                      borderRadius: "8px",
                      fontSize: "1.1rem"
                    }}
                  />
                ) : (
                  <span className={todo.completed ? "completed-text" : ""}>
                    {todo.content}
                  </span>
                )}

                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <button
                    className="complete-btn"
                    onClick={() => toggleComplete(list.id, todo.id)}
                  >
                    ✓
                  </button>

                  {!(editingTodo?.listId === list.id && editingTodo?.todoId === todo.id) && (
                    <button
                      onClick={() => setEditingTodo({ listId: list.id, todoId: todo.id })}
                      style={{
                        background: "none",
                        border: "none",
                        fontSize: "1.55rem",
                        color: "#d81b60",
                        cursor: "pointer",
                        padding: "4px 6px",
                      }}
                    >
                      ✏️
                    </button>
                  )}

                  <button
                    onClick={() => deleteTodo(list.id, todo.id)}
                    style={{ 
                      background: "none", 
                      border: "none", 
                      color: "#c2185b", 
                      fontSize: "1.7rem",
                      cursor: "pointer",
                      padding: "4px 6px",
                    }}
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
              onKeyDown={(e) => {
                if (e.key === "Enter") addTodo(list.id);
              }}
            />
            <button onClick={() => addTodo(list.id)}>Lägg till</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;