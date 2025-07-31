🐛 Issue Tracker
A full-stack Issue Tracking Web App built with Node.js, Express, MongoDB, and React. It allows users (Admin & Workers) to log, assign, update, and monitor work-related issues or tasks in real-time, along with status transitions and basic SLA tracking.

✨ Features
🔐 Authentication & Role-based Access (Admin, Worker)

✅ Issue Status Workflow: Open → In Progress → Resolved → Closed / Unresolved

⏳ SLA Timer: Automatically sets due date 7 days after work assignment

📊 Time Tracking: Records time taken to resolve issues

✏️ CRUD for Issues: Create, assign, update, and delete

🔔 Optimistic UI: Real-time updates with confirmation prompts and toasts

🧑‍💻 Tech Stack
🔹 Frontend
React (with Hooks & Context)

Tailwind CSS

Axios

React Router

🔹 Backend
Node.js + Express.js

MongoDB + Mongoose

JWT Authentication

Role-based Middleware

🚀 Getting Started
🔧 Prerequisites
Node.js v16+

MongoDB (local or Atlas)

Vite (for frontend)

📦 Installation
bash
Copy
Edit
# Clone the repository
git clone https://github.com/yourusername/issue-tracker.git
cd issue-tracker

# Backend setup
cd backend
npm install
npm run dev

# Frontend setup (in a new terminal)
cd ../frontend
npm install
npm run dev
🌐 API Overview
Method	Endpoint	Description
GET	/api/issues	Fetch all issues
POST	/api/issues	Create new issue
PUT	/api/issues/:id	Update issue (status, assignment, etc.)
DELETE	/api/issues/:id	Delete an issue
POST	/api/auth/register	User registration
POST	/api/auth/login	User login

🔐 All protected routes require a valid JWT in the Authorization header.

📸 Screenshots
<img width="1896" height="878" alt="image" src="https://github.com/user-attachments/assets/911d4177-5be1-425f-8f01-a072e27f8d6f" />


🧠 Future Improvements
🔍 Search and filter by status/assignee/date

📈 Visual dashboards for admins

📅 Custom SLA durations

✉️ Email notifications for updates

🤝 Contributing
Contributions, issues, and suggestions are welcome!
Feel free to open a Pull Request or an Issue.

📄 License
This project is licensed under the MIT License – see the LICENSE file for details.

