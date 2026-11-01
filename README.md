# CampusCare — Development Log 03: Server-Side Validation

## 1. Project Overview

This stage focuses on implementing and demonstrating **Server-Side Input Validation** in **Node.js** for the **CampusCare** college complaint management portal. 

Client-side validation can easily be bypassed or disabled by users via browser developer tools or direct HTTP requests. To guarantee security and data consistency, all input fields are thoroughly validated and sanitized directly on the Node.js server.

---

## 2. Key NodeJS Concepts Implemented

1. **Modules (`require` & `module.exports`)**:
   - `validators/complaintValidator.js`: Modular logic for validating student complaint data.
   - `validators/authValidator.js`: Modular logic for validating student registration and password complexity.
   - `routes/complaintRoutes.js`: Express Router module handling complaint endpoints.
   - `routes/authRoutes.js`: Express Router module handling user registration endpoints.

2. **Routing (Express `Router`)**:
   - `GET /` — Serves the interactive CampusCare frontend.
   - `GET /api/health` — Returns server health status.
   - `GET /api/complaints` — Retrieves submitted complaints with optional query filtering.
   - `GET /api/complaints/:ticketId` — Retrieves a specific complaint by ticket ID.
   - `POST /api/complaints` — Validates and records new complaints (returns `201 Created` or `400 Bad Request`).
   - `POST /api/auth/register` — Validates and creates student accounts.

3. **Request & Response Handling**:
   - Parses JSON (`express.json()`) and URL-encoded form data (`express.urlencoded()`).
   - Uses appropriate HTTP status codes:
     - `200 OK`: Successful retrieval.
     - `201 Created`: Resource successfully validated and stored.
     - `400 Bad Request`: Validation failure (returns structured error list).
     - `404 Not Found`: Non-existent route or complaint ticket.
     - `500 Internal Server Error`: Uncaught exceptions.

---

## 3. Server-Side Validation Rules

| Field | Rule Type | Server Validation Rule |
|---|---|---|
| `fullName` | String / Regex | Required, 3–50 characters, letters and spaces only (`/^[A-Za-z\s.]{3,50}$/`). |
| `email` | Regex | Required, valid RFC 5322 email pattern (`/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/`). |
| `studentId` | Regex | Required, 4–15 alphanumeric characters (`/^[A-Za-z0-9\-_]{4,15}$/`). |
| `department` | Whitelist Enum | Must be one of: *Computer Science*, *Information Technology*, *Electronics & Communication*, *Mechanical Engineering*, *Civil Engineering*, *Business Administration*. |
| `category` | Whitelist Enum | Must be one of: *Hostel*, *Academic*, *Infrastructure*, *Mess / Food*, *Library*, *Transport*, *Other*. |
| `title` | String length | Required, 5 to 100 characters. |
| `description` | String length | Required, minimum 15 characters (prevents spam/empty complaints), maximum 600 characters. |
| `priority` | Whitelist Enum | Must be one of: *Low*, *Medium*, *High*, *Urgent*. |
| `password` | Security Regex | Required, minimum 8 characters, at least 1 uppercase letter, 1 lowercase letter, and 1 digit. |
| `confirmPassword` | Equality check | Must exactly match `password`. |

---

## 4. Project Directory Structure

```text
CampusCare/
├── package.json               # Project manifest, scripts and dependencies
├── server.js                  # Main server entry point & middleware setup
├── validators/
│   ├── complaintValidator.js  # Server-side validation logic for complaints
│   └── authValidator.js       # Server-side validation logic for registration
├── routes/
│   ├── complaintRoutes.js     # GET / POST routes for complaints
│   └── authRoutes.js          # POST registration routes
├── public/
│   ├── index.html             # Responsive CampusCare web UI with test shortcuts
│   ├── styles.css             # Light / Dark theme styling & validation borders
│   └── app.js                 # Client script connecting UI to server validation
├── tests/
│   └── testValidation.js      # Automated test suite (valid & invalid test cases)
└── README.md                  # Project documentation & execution guide
```

---

## 5. Running the Application

### 1. Start the Web Server

From the project root:

```powershell
npm start
```

Or:

```powershell
node server.js
```

Open your browser and navigate to:
```
http://localhost:5000
```

### 2. Run Automated Server-Side Validation Tests

Run the test suite that evaluates all valid and invalid input scenarios:

```powershell
npm test
```

---

## 6. Test Suite Results

The automated test script `tests/testValidation.js` executes 10 test cases:

```text
====================================================
 CampusCare Server-Side Validation Test Suite
====================================================

 ✔ PASS: GET /api/health returns 200 OK and status UP
 ✔ PASS: GET /api/complaints returns 200 OK with seeded records
 ✔ PASS: POST /api/complaints [VALID INPUT] returns 201 Created and ticketId
 ✔ PASS: POST /api/complaints [EMPTY BODY] returns 400 Bad Request with field errors
 ✔ PASS: POST /api/complaints [INVALID EMAIL] rejected with 400 and email error message
 ✔ PASS: POST /api/complaints [SHORT DESCRIPTION] rejected with 400 Bad Request
 ✔ PASS: POST /api/complaints [INVALID CATEGORY] rejected with 400 Bad Request
 ✔ PASS: POST /api/auth/register [VALID INPUT] returns 201 Created
 ✔ PASS: POST /api/auth/register [WEAK PASSWORD & MISMATCH] rejected with 400 Bad Request
 ✔ PASS: GET /api/nonexistent-route returns 404 Not Found

----------------------------------------------------
Summary: Passed: 10 | Failed: 0 | Total: 10
----------------------------------------------------
```
