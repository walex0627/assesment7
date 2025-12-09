# 🛡️ Support Ticket System API (`assesment7`)

This project implements a robust RESTful API for managing support tickets, users, and administrative resources. Its core feature is a strong, unified **Policy-Based Access Control (PBAC)** system built on NestJS Guards, ensuring dynamic authorization based on both user roles and resource ownership/assignment.

## 🚀 Key Features

* **JWT Authentication:** Secure login and registration using JSON Web Tokens.
* **Unified Authorization:** A single **`PolicyGuard`** enforces all access rules across the application.
* **Role-Based Access Control (RBAC):** Static protection for administrative CRUD operations (`@Roles('Administrator')`).
* **Attribute-Based Access Control (ABAC):** Dynamic protection for tickets based on **Client ownership** or **Technician assignment**.
* **Modular Design:** Separate modules for Users, Roles, Clients, Technicians, Categories, Tickets, and Access.
* **TypeORM & PostgreSQL:** Object-Relational Mapping for robust data handling.
* **Swagger Documentation:** Interactive API documentation for easy testing and development.

***

## ⚙️ Setup and Installation

### Prerequisites

* Node.js (LTS recommended)
* npm or yarn
* PostgreSQL Database

### Steps

1.  **Clone the Repository:**
    ```bash
    git clone [repository_url]
    cd assesment7/app
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the project root and configure your database and JWT secrets:

    ```env
    # Node.js App
    APP_CONTAINER_NAME=p7_app 
    APP_PORT=3000
    NODE_ENV=development
    APP_CPU_LIMIT=0.50
    APP_MEM_LIMIT=512M

    # PostgreSQL
    POSTGRES_HOST=localhost
    DB_CONTAINER_NAME=postgres_db
    POSTGRES_USER=postgres
    POSTGRES_PASSWORD=walteralex0627
    POSTGRES_DB=p7_db
    POSTGRES_PORT=5432
    POSTGRES_LOCAL=5433
    DB_CPU_LIMIT=0.5
    DB_MEM_LIMIT=512M

    # JWT token and refresh token
    JWT_SECRET=my_super_secret_key
    JWT_EXPIRES_IN=3600

    ```

4.  **Run Migrations / Start Database:**
    Ensure your database is running and the necessary tables are created.

5.  **Run the Application:**
    ```bash
    npm run start:dev
    ```
    The API will be available at `http://localhost:3000`.


6. If you have **Docker**, you only need introduce this in the project root:

```
  cd ..
  docker compose up --build

```
***

## 🛡️ Authorization Architecture (PolicyGuard)

The core security logic is centralized in the **`PolicyGuard`** (`src/common/guards/policy.guard.ts`). This guard checks for the `@Public()` decorator first, then routes the request to either a static role check or a dynamic resource check (ABAC).

### Key Authorization Decorators

| Decorator | Purpose | Policy Enforcement |
| :--- | :--- | :--- |
| **`@Public()`** | Bypasses all authentication/authorization guards. | Used for `/auth/login` and `/auth/register`. |
| **`@Roles('Role')`** | Enforces static access based on the user's role in the JWT payload. | Used for Admin CRUD routes and Client ticket creation. |

### Dynamic Ticket Access Rules

| User Role | Policy Check | Example Endpoint |
| :--- | :--- | :--- |
| **Client** | Must be the **owner** of the ticket resource. | `GET /tickets/:id` (Read only their own) |
| **Technician** | Must be **assigned** to the specific ticket resource. | `PATCH /tickets/:id/status` (Update status) |
| **Administrator** | Access granted implicitly to all resources. | `GET /tickets` (List all) |

***

## 🔗 Endpoints and Access Control Summary

The following table summarizes access permissions for key endpoints.

| Route | Method | Description | Required Access / Policy |
| :--- | :--- | :--- | :--- |
| `/auth/register` | `POST` | Creates an access record. | **@Public()** |
| `/auth/login` | `POST` | Authenticates and returns JWT. | **@Public()** |
| `/users`, `/categories`, `/clients`, `/technicians` | CRUD | Full management of administration entities. | **`@Roles('Administrator')`** |
| `/tickets` | `POST` | Creates a new support ticket. | **`@Roles('Client')`** |
| `/tickets` | `GET` | Lists all tickets. | **`@Roles('Administrator')`** |
| `/tickets/:id` | `GET` | Retrieves a single ticket. | **Dynamic:** Owner OR Assigned Technician OR Admin |
| `/tickets/:id/status` | `PATCH` | Updates the ticket status. | **Dynamic:** Assigned Technician OR Admin |
| `/tickets/client/:id` | `GET` | Client's personal ticket history. | **Dynamic:** Client must match param ID OR Admin |
| `/tickets/technician/:id` | `GET` | Technician's assigned ticket list. | **Dynamic:** Technician must match param ID OR Admin |

***

## 🔑 Initial Credentials (for Testing)

The following credentials were used to populate the database and should be used to obtain the initial JWT token via `POST /auth/login`.

| Role | Email | Password |
| :--- | :--- | :--- |
| **Administrator** | `admin@global.com` | **`123456`** |
| **Technician** | `leo.tech@servicios.com` | **`123456`** |
| **Client** | `cliente.abc@empresa.com` | **`123456`** |

***

## 🧪 Running Tests

This project uses **Jest** for unit testing. The focus of the current unit tests is on the core business logic and security dependencies within the **`TicketService`**.

### Execute All Tests

```bash
npm run test
Run Coverage Report
The required minimum coverage is 40%.
```
```Bash

npm run test:cov
Run Specific Service Tests
To run only the unit tests for the TicketService:
```
```Bash

npm run test -- src/ticket/ticket.service.spec.ts
```
Note on Test Environment
If you encounter errors like Cannot find module 'src/...' during testing, ensure your package.json contains the necessary path mapping:

```
JSON

"jest": {
    // ... other configurations
    "moduleNameMapper": {
      "^src/(.*)$": "<rootDir>/$1" 
    }
  }
```