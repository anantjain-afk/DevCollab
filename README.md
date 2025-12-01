# DevCollab — Project Proposal


DevCollab — A Real-Time Collaborative Platform for Developers

## 1. Project Overview

DevCollab is a full‑stack web application designed to streamline project management and collaboration for small developer teams. The platform sits between overly simplistic to‑do apps and heavyweight enterprise tools by providing an integrated, developer‑centric workspace where teams can:

- Manage tasks visually with a Kanban board.
- Share and version useful code snippets with syntax highlighting.
- Communicate in real time inside project workspaces.

The primary goal is to boost productivity and team synergy by reducing context switching and centralizing project activity.

## 2. Key Features

- Secure User Authentication — JWT-based auth with hashed passwords.
- Project Workspaces — Create projects, invite collaborators, and manage memberships.
- Role-Based Authorization — Admin and Member roles (Admins manage project settings and access).
- Interactive Kanban Board — Drag-and-drop tasks across `To Do`, `In Progress`, and `Done` columns.
- Code Snippet Library — Per-project repository for code snippets with syntax highlighting and versioning.
- Real-Time Project Chat — In-app chat using WebSockets (Socket.IO) for instant team communication.

## 3. Technology Stack

| Area     | Technology / Library                                         | Purpose                                                           |
| -------- | ------------------------------------------------------------ | ----------------------------------------------------------------- |
| Frontend | React.js, Material UI, Axios, Socket.IO Client               | Build SPA, UI components, API requests, real-time client features |
| Backend  | Node.js, Express.js, Prisma (ORM), Socket.IO, JWT, Bcrypt.js | REST API, DB access, realtime connections, auth and security      |
| Database | MySQL                                                        | Relational data storage for users, projects, tasks, and relations |

## 4. How the Project Meets Course Requirements

Below is a concise mapping of the course requirements to the planned implementation in DevCollab.

| Requirement Category |                               Requirement | Met? | Implementation in DevCollab                                                                                          |
| -------------------- | ----------------------------------------: | :--: | -------------------------------------------------------------------------------------------------------------------- |
| Backend              |            Authentication & Authorisation |  ✅  | Secure JWT-based registration and login. Role checks restrict sensitive actions (e.g., only Admins can add members). |
| Backend              |       Create, Read, Update, Delete (CRUD) |  ✅  | Full CRUD for Projects, Tasks, and Code Snippets.                                                                    |
| Backend              | Filtering, Searching, Sorting, Pagination |  ✅  | Task search by title, filter by assignee, sort projects by date, and paginate project lists.                         |
| Backend              |                                   Hosting |  ✅  | Backend containerized with Docker and deployable on Render / AWS / similar.                                          |
| Database             |                       Relational Database |  ✅  | MySQL + Prisma ORM with schema for Users, Projects, Tasks, Snippets and relationships.                               |
| Database             |                                   Hosting |  ✅  | Plan to host on PlanetScale / AWS RDS for persistence and availability.                                              |
| Frontend             |                Routing for multiple pages |  ✅  | React Router for routes such as `/login`, `/dashboard`, `/project/:id`.                                              |
| Frontend             |                  Dynamic fetching of data |  ✅  | Axios for REST calls; Socket.IO for real-time updates; views populate with live data.                                |
| Frontend             |                                   Hosting |  ✅  | Frontend deployed as static site on Vercel / Netlify, configured to call the hosted backend.                         |

## 5. Extras and Stretch Goals (Optional)

- Task comments and @mentions
- File attachments for tasks and snippets
- Activity feed/audit log per project
- Integrations with GitHub gists or external snippet providers
