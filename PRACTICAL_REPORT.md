# PRACTICAL NO. 4

## Back-End Web Development: Server-Side Validation using NodeJS

**Project Title:** CampusCare — College Complaint & Issue Management  

**Submitted by:** [Your Name]  
**Course:** B.Tech in Software Engineering  
**College:** MIT Academy of Engineering, Alandi, Pune  
**Subject:** Web Technology  
**Academic Year:** 2026–27  
**PRN:** [Your PRN / Roll No]  

---

## 1. Aim

To design, develop, and test a NodeJS web application that demonstrates server-side input validation, modular routing, appropriate handling of HTTP GET and POST requests, and interactive user feedback through error and success messages.

---

## 2. Objectives

- To create a web application using NodeJS and ExpressJS.
- To implement strict server-side validation for all incoming user inputs.
- To handle HTTP GET and POST requests appropriately using Express routing.
- To return appropriate HTTP status codes (`200`, `201`, `400`) and display structured success and error messages.
- To use core NodeJS concepts such as modules, routing, and request/response handling.
- To test the application thoroughly with both valid and invalid input sets.
- To deploy the application and make it accessible via a public URL.

---

## 3. Problem Statement

Client-side HTML5 or browser JavaScript validation can be easily bypassed or disabled by users via browser settings, developer tools, or automated API testing tools like Postman and cURL. Without verification on the server, malformed, empty, or malicious data can enter the backend system, leading to security flaws, data corruption, and application crashes.

The **CampusCare** application solves this by implementing an independent server-side validation layer in NodeJS. Every submitted complaint is inspected by the server for name format, email structure, roll number presence, category whitelist, and description length before confirming registration and issuing a tracking ticket.

---

## 4. Technologies Used

- **NodeJS:** Executes JavaScript on the server environment and manages the runtime.
- **ExpressJS:** Fast, unopinionated web framework for routing, middleware, and request/response handling.
- **JavaScript (ES6+):** Implements business logic, regular expressions, and validation rules.
- **HTML5:** Provides semantic structure for the web forms and interface.
- **CSS3 & Bootstrap 5:** Styles the interface, provides responsive layout, and displays colored feedback alerts.
- **Git and GitHub:** Version control system to track and host the project source code.
- **Render / Vercel:** Cloud hosting platform used to deploy the backend and frontend application publicly.

---

## 5. System Implementation

### 5.1 User Interface

The application provides a clean, responsive single-page portal with fields for student name, college email, roll number, complaint category, and issue description. It includes quick-fill buttons for instant testing.

> *[INSERT SCREENSHOT 1: Complete CampusCare complaint form interface]*  
> **Figure 1: CampusCare complaint management user interface.**

---

### 5.2 Server-Side Form Validation

The NodeJS server intercepts incoming `POST` requests and validates all fields against strict rules:
- **Student Name:** Must not be blank, minimum 3 characters, alphabets and spaces only (`/^[A-Za-z\s]+$/`).
- **College Email:** Must adhere to standard RFC email format (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`).
- **Roll Number:** Mandatory alphanumeric identifier.
- **Category:** Restricted to an approved whitelist (`Hostel`, `Academic`, `Infrastructure`, `Mess / Food`, `Library`).
- **Description:** Mandatory, minimum 10 characters to prevent spam or empty submissions.

If any field fails validation, the server immediately halts processing, sets the HTTP response status to **`400 Bad Request`**, and sends back a JSON response containing an array of specific error messages.

> *[INSERT SCREENSHOT 2: Validation errors displayed after submitting invalid inputs]*  
> **Figure 2: Server-side validation errors and feedback messages.**

---

### 5.3 Successful Submission

When all input fields satisfy the server validation criteria, the server:
1. Generates a unique tracking Ticket ID (`CC-102`, `CC-103`, etc.).
2. Appends the sanitized complaint record to the active records store.
3. Sets the HTTP response status to **`201 Created`**.
4. Returns a success confirmation message along with the created ticket details.

> *[INSERT SCREENSHOT 3: Green success alert showing assigned Ticket ID]*  
> **Figure 3: Success message after valid server-side validation.**

---

### 5.4 NodeJS Modules, Routing, and Request/Response Handling

The architecture uses core NodeJS concepts:
- **Modules:** Built-in module `path` resolves file system paths, and third-party module `express` handles web server operations.
- **Middleware:** `express.json()` and `express.urlencoded()` parse incoming request bodies into `req.body`.
- **Routing:** Express route handlers manage endpoints:
  - `app.get('/')`: Serves the static HTML interface.
  - `app.get('/complaints')`: Returns registered complaints in JSON format.
  - `app.post('/submit-complaint')`: Handles data submission and executes the validation function.
- **Request/Response:** Reads values from `req.body` and returns structured JSON using `res.status(code).json(payload)`.

> *[INSERT SCREENSHOT 4: VS Code editor showing project structure, server.js, and package.json]*  
> **Figure 4: Application directory structure and server implementation.**

---

## 6. Testing and Results

The web application was evaluated across multiple test scenarios covering both valid entries and intentional validation violations.

| Test Case | Input or Action | Expected Result | Actual Result | Status |
|---|---|---|---|:---:|
| **Empty Form** | Click submit with all fields empty | HTTP 400; displays list of required field errors | Validation errors displayed for all fields | **PASSED** |
| **Invalid Name** | Enter numbers in name (e.g., `R123`) | HTTP 400; name alphabet format error appears | Rejected with: *"Student Name can only contain letters and spaces."* | **PASSED** |
| **Invalid Email** | Enter malformed email (e.g., `not-an-email`) | HTTP 400; email syntax error appears | Rejected with: *"Please enter a valid email address."* | **PASSED** |
| **Missing Roll Number** | Leave roll number blank | HTTP 400; roll number required error appears | Rejected with: *"Roll Number / Student ID is required."* | **PASSED** |
| **Invalid Category** | Send category outside approved whitelist | HTTP 400; category error appears | Rejected with: *"Please select a valid complaint category."* | **PASSED** |
| **Short Description** | Enter fewer than 10 characters (e.g., `Fix`) | HTTP 400; minimum length error appears | Rejected with: *"Description is too short (min 10 chars)."* | **PASSED** |
| **Valid Submission** | Enter all valid details and click submit | HTTP 201; green success banner with Ticket ID | Success message and Ticket ID displayed | **PASSED** |
| **Fetch Complaints** | Send `GET /complaints` request | HTTP 200; returns array of saved complaints | Stored complaint list returned | **PASSED** |

**Result:** The application was thoroughly tested with valid and invalid inputs. The server-side validation and feedback mechanisms behaved exactly as expected.

---

## 7. GitHub Repository

The complete source code is maintained and version-controlled in a public GitHub repository.

**Repository URL:** [https://github.com/your-username/CampusCare-NodeJS-Validation](https://github.com/your-username/CampusCare-NodeJS-Validation)

> *[INSERT SCREENSHOT 5: Project source code hosted on GitHub]*  
> **Figure 5: Project source code repository hosted on GitHub.**

---

## 8. Deployment

The application is deployed to cloud infrastructure and is accessible through the following public URL:

**Live Application URL:** [https://campuscare-validation.onrender.com/](https://campuscare-validation.onrender.com/)

> *[INSERT SCREENSHOT 6: Deployed CampusCare application running in browser]*  
> **Figure 6: Deployed CampusCare application on cloud hosting.**

---

## 9. Conclusion

The **CampusCare** complaint management application was developed successfully using **NodeJS** and **ExpressJS**. It demonstrates effective handling of HTTP GET and POST requests, robust server-side input validation using regular expressions and whitelisting, informative error and success feedback, and structured request/response handling. The application was thoroughly validated with automated tests, uploaded to GitHub, and prepared for cloud deployment.

---

## 10. Learning Outcomes

- Understood the core architecture of backend web applications using NodeJS.
- Learned the critical security difference between client-side and server-side validation.
- Implemented HTTP GET and POST routes using ExpressJS.
- Handled incoming request data using `req.body` and returned appropriate HTTP status codes (`200`, `201`, `400`).
- Formatted structured error and success JSON responses.
- Mastered regular expression patterns for email, name, and string sanitization.
- Learned how to manage and version-control source code using Git and GitHub.
- Understood cloud deployment processes for NodeJS backend applications.
