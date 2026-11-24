# TaskFlow – Simple To-Do List Web Application

TaskFlow is a modern, responsive, full-stack task management web application designed with simplicity, performance, and clean productivity in mind. Built with **React.js**, **Node.js**, **Express.js**, and **Supabase PostgreSQL**, TaskFlow provides a complete solution for personal and team task organization without cognitive clutter.

---

## 🌟 Key Features

- **User Authentication**: Secure user sign-up and sign-in powered by Supabase Authentication (Email/Password) with encrypted tokens and session persistence.
- **Task Management (CRUD)**:
  - Create new tasks with title, description, priority, category, and due date.
  - View all user-owned tasks with clear visual statuses.
  - Edit existing tasks in place.
  - Delete tasks with interactive confirmation dialogs.
- **Real-Time Task Completion**: Instantly mark tasks as completed or pending with smooth visual strikethrough.
- **Priority Categorization**:
  - 🔴 **High Priority**: Highlighted with soft red accents.
  - 🟠 **Medium Priority**: Highlighted with soft orange accents.
  - 🟢 **Low Priority**: Highlighted with soft green accents.
- **Due Date Tracking**: Smart date formatting indicating "Today", "Tomorrow", or "Overdue" status.
- **Live Search & Multilevel Filtering**:
  - Search by task title or description keywords.
  - Filter by status (`All`, `Pending`, `Completed`).
  - Filter by category (`Personal`, `Work`, `Study`, `Other`).
  - Filter by priority (`High`, `Medium`, `Low`).
  - Quick sidebar views: `All Tasks`, `Today's Tasks`, `Upcoming Tasks`, `Pending Tasks`, `Completed Tasks`.
  - Sort by `Newest First`, `Oldest First`, `Due Date`, or `Priority`.
- **Dynamic Dashboard Statistics**: Real-time summary cards for **Total Tasks**, **Completed Tasks**, **Pending Tasks**, and **Overdue Tasks**.
- **Security & Multi-Tenancy**: Enforced via PostgreSQL **Row-Level Security (RLS)** and verified session tokens on the Express backend. Users can never view, update, or delete another user's tasks.
- **Clean & Responsive UI**: Tailored for desktop, tablet, and mobile layouts with accessible controls, smooth hover transitions, and collapsible navigation.

---

## 🏗️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React.js (v18), Vite, React Router DOM (v6), Lucide React (Icons), Native Fetch API, Custom CSS Design System |
| **Backend** | Node.js (v24), Express.js (v4), CORS, Dotenv, `@supabase/supabase-js` |
| **Database** | Supabase PostgreSQL with Row Level Security (RLS) & Triggers |
| **Authentication** | Supabase Authentication (JWT Bearer Token verification) |

---

## 📁 Project Structure

```text
To-do-list/
├── backend/
│   ├── config/
│   │   └── supabase.js             # Supabase clients (User & Service Admin)
│   ├── controllers/
│   │   ├── authController.js       # Register, Login, Logout, Profile controllers
│   │   └── taskController.js       # Task CRUD, filters, and statistics logic
│   ├── middleware/
│   │   └── authenticate.js         # JWT verification & request-user scoping
│   ├── routes/
│   │   ├── authRoutes.js           # /api/auth routes
│   │   └── taskRoutes.js           # /api/tasks routes
│   ├── server.js                   # Express application entrypoint
│   ├── package.json
│   └── .env.example
├── database/
│   └── schema.sql                  # PostgreSQL tables, RLS policies, triggers & indexes
├── frontend/
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── Navbar.jsx          # Top brand navigation & auth buttons
│   │   │   ├── SearchBar.jsx       # Search input & filter/sort dropdowns
│   │   │   ├── Sidebar.jsx         # Dashboard navigation & task counters
│   │   │   ├── TaskCard.jsx        # Individual task card with status toggle
│   │   │   ├── TaskForm.jsx        # Modal form for Add and Edit actions
│   │   │   └── TaskStats.jsx       # 4 metric overview cards
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # Global authentication provider
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx       # Main task dashboard
│   │   │   ├── Home.jsx            # Landing page with interactive preview
│   │   │   ├── Login.jsx           # User sign in page
│   │   │   └── Register.jsx        # User registration page
│   │   ├── services/
│   │   │   ├── api.js              # Centralized Fetch API client with Bearer tokens
│   │   │   └── supabase.js         # Frontend Supabase configuration
│   │   ├── App.jsx                 # Routing configuration & protected routes
│   │   ├── index.css               # Complete stylesheet & variables
│   │   └── main.jsx                # React root mount
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── .env.example
└── README.md
```

---

## 🛠️ Step-by-Step Supabase Setup

### 1. Create a Supabase Project
1. Visit [supabase.com](https://supabase.com) and create a free account.
2. Click **New Project** and configure your project name (e.g. `TaskFlow`) and database password.
3. Select the region nearest to you and wait for database provisioning to finish.

### 2. Run Database Migrations
1. In your Supabase Project Dashboard, navigate to the **SQL Editor** from the left navigation.
2. Click **New Query**.
3. Copy and paste the entire contents of `database/schema.sql`.
4. Click **Run**.
5. This automatically:
   - Creates the `profiles` table linked to `auth.users`.
   - Creates the `tasks` table with foreign key constraints.
   - Configures optimized database indexes.
   - Enables **Row Level Security (RLS)** on both tables.
   - Establishes RLS policies ensuring users can only read, insert, update, and delete their own records.
   - Sets up automatic timestamp triggers and profile creation triggers.

### 3. Retrieve API Credentials
1. In your Supabase Dashboard, go to **Project Settings** (gear icon) -> **API**.
2. Locate the following credentials:
   - **Project URL**: e.g., `https://xyzcompany.supabase.co`
   - **Project API Keys**:
     - `anon` `public`: Safe for frontend and standard backend queries.
     - `service_role` `secret`: Backend administrative operations (keep this secret!).

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
Create a file named `.env` inside the `backend/` folder:

```env
PORT=5000
CLIENT_URL=http://localhost:5173

# Supabase Credentials
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-public-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-secret-key
```

### Frontend (`frontend/.env`)
Create a file named `.env` inside the `frontend/` folder:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-public-key
```

---

## 🚀 Installation & Local Development

### 1. Install Backend Dependencies
Open your terminal in the `backend/` folder:

```bash
cd backend
npm install
```

### 2. Install Frontend Dependencies
In another terminal, navigate to the `frontend/` folder:

```bash
cd frontend
npm install
```

### 3. Start the Backend Server
From the `backend/` directory:

```bash
npm run dev
# Or: npm start
```
The backend starts on `http://localhost:5000`. You should see:
```text
===============================================
🚀 TaskFlow Backend running on port 5000
📡 Health Check: http://localhost:5000/api/health
💻 Allowed Client URL: http://localhost:5173
===============================================
```

### 4. Start the Frontend Application
From the `frontend/` directory:

```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

---

## 📡 API Documentation

All protected endpoints require the HTTP header:
`Authorization: Bearer <JWT_ACCESS_TOKEN>`

### Authentication Endpoints

#### `POST /api/auth/register`
Creates a new user and provisions their profile.
- **Request Body**:
  ```json
  {
    "full_name": "Sarah Connor",
    "email": "sarah@example.com",
    "password": "Password123"
  }
  ```
- **Response `201 Created`**:
  ```json
  {
    "success": true,
    "message": "Account created successfully!",
    "user": { "id": "uuid", "email": "sarah@example.com", "full_name": "Sarah Connor" },
    "session": { "access_token": "..." }
  }
  ```

#### `POST /api/auth/login`
Authenticates an existing user.
- **Request Body**:
  ```json
  {
    "email": "sarah@example.com",
    "password": "Password123"
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "message": "Logged in successfully.",
    "user": { "id": "uuid", "email": "sarah@example.com", "full_name": "Sarah Connor" },
    "session": { "access_token": "..." }
  }
  ```

#### `POST /api/auth/logout` *(Protected)*
Signs the user out.

#### `GET /api/auth/me` *(Protected)*
Returns the current authenticated user's profile details.

---

### Task Endpoints *(All Protected)*

#### `GET /api/tasks`
Fetches tasks for the authenticated user with optional query filters:
- `filter`: `all` | `today` | `upcoming` | `pending` | `completed`
- `status`: `all` | `pending` | `completed`
- `priority`: `all` | `low` | `medium` | `high`
- `category`: `all` | `Personal` | `Work` | `Study` | `Other`
- `search`: search query keyword
- `sort`: `newest` | `oldest` | `due_date` | `priority`
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "count": 2,
    "tasks": [
      {
        "id": "e2f1...",
        "user_id": "...",
        "title": "Prepare Sprint Demo",
        "description": "Assemble slides and record short video",
        "due_date": "2026-11-25",
        "priority": "high",
        "category": "Work",
        "status": "pending",
        "created_at": "2026-11-24T12:00:00Z",
        "updated_at": "2026-11-24T12:00:00Z"
      }
    ]
  }
  ```

#### `GET /api/tasks/stats`
Returns aggregated task counters for the current user.
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "stats": {
      "total": 12,
      "completed": 8,
      "pending": 4,
      "overdue": 1
    }
  }
  ```

#### `POST /api/tasks`
Creates a new task.
- **Request Body**:
  ```json
  {
    "title": "Study Algorithm Chapter 4",
    "description": "Complete graphs and BFS problems",
    "due_date": "2026-11-30",
    "priority": "medium",
    "category": "Study"
  }
  ```

#### `PUT /api/tasks/:id`
Updates an existing task's title, description, due date, priority, or category.

#### `PATCH /api/tasks/:id/status`
Toggles or sets completion status:
- **Request Body**: `{ "status": "completed" }` or `{ "status": "pending" }`

#### `DELETE /api/tasks/:id`
Permanently deletes a task belonging to the authenticated user.

---

## 🔒 Security Best Practices Implemented

1. **Row-Level Security (RLS)**: PostgreSQL enforces that users cannot query or mutate rows where `user_id != auth.uid()`.
2. **Never Trust the Frontend**: The backend never accepts `user_id` from request bodies or parameters; the identity is strictly derived from verified Supabase JWT tokens via `supabase.auth.getUser()`.
3. **No Secret Keys in Frontend**: The Supabase service role secret is solely accessible by the Express backend and is never bundled in frontend code.
4. **Input Sanitization & Validation**: Form fields are verified for valid email format, minimum password length, and non-empty strings.

---

## 📱 Responsive Layout Details

- **Desktop (>= 900px)**: Two-column layout featuring an ergonomic fixed sidebar, task cards with detailed metadata tags, and quick-access filter controls.
- **Tablet & Mobile (< 900px)**: Automatically switches to a horizontal navigation bar, stacks task metadata for effortless tapping, and adjusts modal dialogs to full-width screen bounds.

---

## 📄 License

This project is licensed under the MIT License. Feel free to use and adapt it for learning, portfolios, or production apps!
