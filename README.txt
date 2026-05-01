Team Task Manager (Full-Stack)
==============================

A full-stack web application designed for seamless project organization, team collaboration, and task management. It provides role-based access control (RBAC) ensuring admins can manage projects securely, a beautiful Kanban board for task tracking, and powerful interactive UI elements.

## Features Let's Built
1. **Authentication (Signup/Login)**: Secure JWT-based auth.
2. **Project & Team Management**: Complete creation flow and member inviting mechanism based on roles (Admin vs. Member).
3. **Task Tracking & Kanban**: Interactive Kanban column style interface with priority indicators, date formatting, and assignee tools.
4. **Dashboard Analytics**: Shows user stats including overdue tasks and statuses layout with charts.

## Technologies Used
- Frontend: React 19, Vite, TailwindCSS (glassmorphism designs), lucide-react (Premium visuals).
- Backend: FastAPI, SQLAlchemy, PostgreSQL.

## How to Run Locally
1. **Backend**:
   - Navigate to `/backend` directory.
   - Setup a `.env` file containing your `DATABASE_URL` and `SECRET_KEY`.
   - Run `pip install -r requirements.txt`.
   - Start using `uvicorn app.main:app --reload`.
2. **Frontend**:
   - Navigate to `/frontend` directory.
   - Run `npm install`.
   - Run `npm run dev`.

## Deployment to Railway
The app is natively set up to be pushed to Railway.
If Railway connects directly to your GitHub repository:
- Push all these files to your own GitHub repo.
- Go to Railway, create a new service from your GitHub repo.
- Add `VITE_API_URL` to your frontend service linking it to your deployed backend URL.
- Make sure to give the deployed backend URL the appropriate startup configuration: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
