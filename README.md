# FullstackApp

# Elvira Ajdarpasic

## Starta backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app:app --reload
```

## Starta Frontend
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
