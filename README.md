# FullstackApp

**Elvira Ajdarpasic**

En komplett fullstack todo-applikation byggd med **FastAPI** (backend) och **React** (frontend).

## Funktioner
- Skapa och hantera flera todolistor
- Lägga till, redigera, bocka av och ta bort uppgifter (todos)
- Redigera både listans titel och enskilda todos
- Snygg och responsiv design

## Teknikstack
- **Backend**: FastAPI, SQLAlchemy, Pydantic, SQLite
- **Frontend**: React, JavaScript (Fetch API), CSS

## Projektstruktur

```bash
fullstackapp/
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   ├── models/
│   ├── schemas/
│   └── routes/
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Hur du startar applikationen

### 1. Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app:app --reload
```
### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```
## API Endpoints

* `POST /todolists/` – Skapa ny todolista  
* `GET /todolists/` – Hämta alla todolistor  
* `GET /todolists/{list_id}` – Hämta en specifik lista  
* `PUT /todolists/{list_id}` – Uppdatera listans titel  
* `DELETE /todolists/{list_id}` – Ta bort lista  

* `POST /todolists/{list_id}/todos` – Lägg till todo i en lista  
* `PUT /todolists/{list_id}/todos/{todo_id}` – Redigera en todo  
* `DELETE /todolists/{list_id}/todos/{todo_id}` – Ta bort en todo  
* `PATCH /todolists/{list_id}/todos/{todo_id}/complete` – Bocka av / ångra todo

## Hur man använder appen

1. Starta backend och frontend  
2. Öppna webbläsaren på http://localhost:5173/
3. Skapa en ny todolista genom att skriva en rubrik och klicka på "Lägg till lista"  
4. Lägg till uppgifter i listan genom att skriva i fältet och klicka på "Lägg till" 
5. Använd ✓ för att bocka av, ✏️ för att redigera och × för att ta bort uppgifter  
6. Du kan även redigera listans titel med pennan uppe till höger
```
