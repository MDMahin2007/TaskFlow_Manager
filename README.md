# TaskFlow Manager

A full-stack MERN task manager built for Job Sheet-1 (MERN Stack Web Development assessment).

## Stack
- **Frontend:** React (Vite) + Tailwind CSS
- **Backend:** Node.js + Express.js
- **Database:** MongoDB + Mongoose

## Folder structure
```
taskflow/
  client/   -> React + Tailwind frontend
  server/   -> Express + MongoDB backend
```

## Run locally

### 1. Backend
```bash
cd server
npm install
cp .env.example .env      # edit MONGO_URI if needed
npm run dev                # or: npm start
```
Server runs at http://localhost:5000

### 2. Frontend
```bash
cd client
npm install
npm run dev
```
App runs at http://localhost:5173

Make sure MongoDB is running locally (`mongod`) or point `MONGO_URI` in `server/.env` to a MongoDB Atlas connection string.

## API Endpoints
| Method | Endpoint      | Description              |
|--------|---------------|---------------------------|
| GET    | /tasks        | Get all tasks             |
| POST   | /tasks        | Create a task `{ title }` |
| PUT    | /tasks/:id    | Toggle/set task status    |
| DELETE | /tasks/:id    | Delete a task             |

Task JSON shape: `{ "_id", "title", "status": "pending"|"completed", "createdAt" }`

## Deployment (suggested)
1. Push this repo to GitHub.
2. Create a free MongoDB Atlas cluster, copy the connection string.
3. Deploy `server/` to Render (or Heroku): set env vars `MONGO_URI`, `CLIENT_ORIGIN`, `PORT`.
4. Deploy `client/` to Vercel (or Netlify): set env var `VITE_API_URL` to your deployed backend URL.
5. Test the live link end-to-end.

## Testing the API
Use Postman/Insomnia:
- `POST http://localhost:5000/tasks` with body `{ "title": "Buy groceries" }`
- `GET http://localhost:5000/tasks`
- `PUT http://localhost:5000/tasks/<id>` with body `{ "status": "completed" }`
- `DELETE http://localhost:5000/tasks/<id>`
