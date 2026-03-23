import { useEffect, useState } from "react";

function App() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");

  // Hämta böcker från backend
  const fetchBooks = async () => {
    const res = await fetch("http://127.0.0.1:8000/books/");
    const data = await res.json();
    setBooks(data);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Lägg till bok
  const addBook = async () => {
    await fetch("http://127.0.0.1:8000/books/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, author }),
    });

    setTitle("");
    setAuthor("");
    fetchBooks();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>📚 Mina Böcker</h1>

      <input
        placeholder="Titel"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        placeholder="Författare"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
      />
      <button onClick={addBook}>Lägg till</button>

      <ul>
        {books.map((book) => (
          <li key={book.id}>
            {book.title} - {book.author}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;