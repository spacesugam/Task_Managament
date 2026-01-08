# ⚡ Taskly: Premium Task Management API & Dashboard

Taskly is a robust, production-ready Task Management system built with **Spring Boot 3.2.0**. It features a RESTful API with automated database migrations, API Key authentication, and a stunning, modern **Glassmorphism Web Dashboard**.

---

## 🚀 Key Features

### 🛠 Backend (Spring Boot)
- **Full CRUD Operations**: Manage Users and Tasks with ease.
- **RESTful API**: Follows industry standards with proper HTTP status codes.
- **Security**: Static API Key authentication via `X-API-KEY` header.
- **Database**: H2 In-Memory database (enabled for testing) with **Flyway Migrations**.
- **Pagination & Filtering**: Efficiently handle large datasets with built-in search and filters.
- **Validation**: Strict input validation using Jakarta Validation.

### 🎨 Frontend (Modern Dashboard)
- **Glassmorphism AI Aesthetics**: A premium, dark-themed UI that feels alive.
- **Real-Time Stats**: Automated dashboard tracking of task statuses.
- **Integrated Sidebar**: Simple navigation between Dashboard, Tasks, and Users.
- **Responsive Interaction**: Create and edit tasks with smooth modal transitions.

---

## 🛠 Tech Stack
- **Java 17** (JDK)
- **Spring Boot 3.2.x**
- **Spring Data JPA** (Hibernate)
- **H2 / PostgreSQL**
- **Maven** (Build Tool)
- **Vanilla HTML/CSS/JS** (Dashboard)
- **Lucide Icons**

---

## 🏁 Getting Started (Windows Setup)

### 1. Prerequisites
Ensure you have the following installed:
- **Java 17**: [Adoptium Temurin 17](https://adoptium.net/temurin/releases/?version=17)
- **Maven**: (Included in project directory if installed via setup script)

### 2. Manual Environment Configuration
In your PowerShell terminal, set the `JAVA_HOME` if it's not in your system variables:

```powershell
$env:JAVA_HOME = "C:\Program Files\Java\jdk-17.0.5"
```

### 3. Build & Run
Navigate to the `task-management-api` directory and run:

```powershell
# Build the project
..\maven\apache-maven-3.9.12\bin\mvn.cmd clean install

# Start the application
..\maven\apache-maven-3.9.12\bin\mvn.cmd spring-boot:run
```

---

## 🌐 API Reference

### Welcome to the Dashboard
Access the UI at: **[http://localhost:8081/index.html](http://localhost:8081/index.html)**

### Authentication
All API requests require the following header:
`X-API-KEY: my-secure-api-key-12345`

### Endpoints

| Category | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **Users** | `POST` | `/api/users` | Create a new user |
| **Users** | `GET` | `/api/users` | List users (Paginated) |
| **Tasks** | `POST` | `/api/tasks` | Create a new task |
| **Tasks** | `GET` | `/api/tasks` | List tasks (Filters & Pagination) |
| **Tasks** | `PUT` | `/api/tasks/{id}` | Full task update |
| **Tasks** | `PATCH` | `/api/tasks/{id}/status` | Update specifically the status |
| **Tasks** | `DELETE` | `/api/tasks/{id}` | Delete a task |

---

## 🗄 Database Management
Access the **H2 Console** to view the raw tables:
- **URL**: [http://localhost:8081/h2-console](http://localhost:8081/h2-console)
- **JDBC URL**: `jdbc:h2:mem:taskdb`
- **Username**: `sa`
- **Password**: (Leave empty)

---

## 🤝 Project Structure
```text
task-management-api/
├── src/main/java/com/taskmanager/
│   ├── config/      # Security & CORS settings
│   ├── controller/  # REST API Endpoints
│   ├── dto/         # Data Transfer Objects & Validation
│   ├── entity/      # JPA Database Models
│   ├── enums/       # Task Status & Priority types
│   ├── filter/      # API Key Authentication Logic
│   ├── repository/  # Database Query Interfaces
│   └── service/     # Business Logic
├── src/main/resources/
│   ├── static/      # Dashboard Files (HTML/CSS/JS)
│   ├── db/migration # Database Schema Scripts
│   └── application.yml # App Configuration (Port 8081)
└── pom.xml          # Project Dependencies
```

---

## 🆘 Troubleshooting

### Port Conflict
If port **8081** is already in use, change the `server.port` in `src/main/resources/application.yml`.

### Maven Not Found
If the `mvn` command fails, ensure you are pointing to the correct path where Maven was extracted: `..\maven\apache-maven-3.9.12\bin\mvn.cmd`.

---

Developed with ❤️ for Advanced Task Management.
