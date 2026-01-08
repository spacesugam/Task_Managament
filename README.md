# Task Management API

A RESTful API for managing tasks and users built with Spring Boot.

## Tech Stack
- Java 17
- Spring Boot 3.2.0
- Spring Data JPA
- H2 Database (default)
- Flyway Migrations
- Lombok

## Quick Start

```bash
# Build
mvn clean install

# Run
mvn spring-boot:run
```

API available at: http://localhost:8080

## API Authentication

Add header to all requests:
```
X-API-KEY: my-secure-api-key-12345
```

## Endpoints

### Users
- POST /api/users - Create user
- GET /api/users - List users (paginated)
- GET /api/users/{id} - Get user

### Tasks
- POST /api/tasks - Create task
- GET /api/tasks - List tasks (filtered, paginated)
- GET /api/tasks/{id} - Get task
- PUT /api/tasks/{id} - Update task
- PATCH /api/tasks/{id}/status - Update status
- DELETE /api/tasks/{id} - Delete task
