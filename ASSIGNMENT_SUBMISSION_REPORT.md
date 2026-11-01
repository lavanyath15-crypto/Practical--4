# LABORATORY EXPERIMENT REPORT / MINI PROJECT ASSIGNMENT

---

## **Title:** Design, Development, and Demonstration of Server-Side Input Validation Using Node.js
**Subject / Course:** Web Technology Laboratory / Software Engineering Practical  
**Academic Level:** Third Year (TY) Software Engineering  
**Application Name:** CampusCare — College Complaint & Issue Management System  
**Developer:** Individual Student Submission  

---

## 1. Objective & Problem Statement

### **1.1 Objective**
To design, develop, and test an individual web application using **Node.js** to demonstrate **server-side validation** for user inputs. The system must process HTTP `GET` and `POST` requests, validate all incoming data fields before persistence, handle errors with appropriate HTTP status codes, and display meaningful success and error messages.

### **1.2 Why Server-Side Validation is Essential**
Client-side HTML5 or JavaScript validation operates only within the user's browser. It can be easily bypassed:
1. Disabling JavaScript in browser settings.
2. Modifying form input attributes through the browser DOM / Developer Tools.
3. Transmitting crafted HTTP `POST` payloads directly using automated tools like Postman, `curl`, or scripts.

Therefore, **Server-Side Validation** is the mandatory security barrier that guarantees data integrity, prevents SQL/NoSQL injection, stops garbage data from entering the database, and ensures application reliability.

---

## 2. Requirements Compliance Checklist

| Lab Instruction Requirement | Implementation in CampusCare | Verification Status |
|---|---|:---:|
| **1. Individual Web Application using Node.js** | Single standalone application powered by Node.js and Express. | **COMPLETED (✔)** |
| **2. Implement Server-Side Validation for User Input** | All fields (`name`, `email`, `rollNo`, `category`, `description`) validated on server via regex, length bounds, and whitelists. | **COMPLETED (✔)** |
| **3. Handle GET / POST Requests Appropriately** | `GET /` (serve UI), `GET /complaints` (retrieve data), `POST /submit-complaint` (submit & validate). | **COMPLETED (✔)** |
| **4. Display Proper Success and Error Messages** | Returns **HTTP 201** with success confirmation on valid data; returns **HTTP 400** with bulleted field-level errors on invalid data. | **COMPLETED (✔)** |
| **5. Use Node.js Concepts (Modules, Routing, Req/Res)** | Employs core modules (`path`, `http`), external modules (`express`), Express routers, middleware (`express.json()`, `express.urlencoded()`), and `req`/`res` objects. | **COMPLETED (✔)** |
| **6. Test Application with Valid and Invalid Inputs** | Verified via interactive web UI ("Fill Valid" / "Fill Invalid" shortcuts) and an automated test suite (`test.js`). | **COMPLETED (✔)** |

---

## 3. Technology Stack & Prerequisites

- **Runtime Environment:** Node.js (v18.x – v24.x)
- **Web Framework:** Express.js (v4.21.x)
- **Frontend Presentation:** HTML5, CSS3, Bootstrap 5 (CDN)
- **Networking Protocol:** HTTP / REST
- **Testing Utility:** Built-in Node.js `http` client (`test.js`)
- **Version Control & Execution:** PowerShell / Bash

---

## 4. System Architecture & Directory Structure

```text
CampusCare/
├── package.json              # Project metadata, dependencies, and execution scripts
├── server.js                 # Primary backend server, routing & server-side validation logic
├── public/
│   └── index.html            # User interface with real-time feedback & validation debug inspector
├── test.js                   # Automated test script verifying valid & invalid scenarios
└── README.md                 # Project development log and instructions
```

---

## 5. Detailed Implementation Breakdown

### **5.1 Node.js Core Concepts Demonstrated**

1. **Modules**:
   - Built-in Module: `path` for cross-platform file path resolution.
   - Built-in Module: `http` for running automated HTTP assertions in `test.js`.
   - Third-Party Module: `express` for web server routing and middleware handling.
2. **Middleware**:
   - `express.json()`: Parses incoming JSON request payloads.
   - `express.urlencoded({ extended: true })`: Parses URL-encoded form submissions.
   - `express.static('public')`: Serves static web assets (`index.html`, styles, scripts).
3. **Routing**:
   - `app.get('/')`: Serves the complaint filing web interface.
   - `app.get('/complaints')`: Retrieves stored complaints in JSON format.
   - `app.post('/submit-complaint')`: Receives `req.body`, runs validation, and sends response.
4. **Request / Response Handling**:
   - Reads inputs from `req.body`.
   - Sends structured JSON responses using `res.status(code).json(payload)`.

---

### **5.2 Server-Side Validation Rules Specification**

```javascript
function validateComplaintInput(data) {
    const errors = [];

    // 1. Name: Required, min 3 characters, alphabets and spaces only
    if (!data.name || data.name.trim() === '') {
        errors.push('Student Name is required.');
    } else if (data.name.trim().length < 3) {
        errors.push('Student Name must have at least 3 characters.');
    } else if (!/^[A-Za-z\s]+$/.test(data.name.trim())) {
        errors.push('Student Name can only contain letters and spaces.');
    }

    // 2. Email: Required, matching standard email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || data.email.trim() === '') {
        errors.push('Email is required.');
    } else if (!emailRegex.test(data.email.trim())) {
        errors.push('Please enter a valid email address (e.g., student@campus.edu).');
    }

    // 3. Roll Number / Student ID: Required, non-empty
    if (!data.rollNo || data.rollNo.trim() === '') {
        errors.push('Roll Number / Student ID is required.');
    }

    // 4. Category: Must belong to allowed whitelist
    const allowedCategories = ['Hostel', 'Academic', 'Infrastructure', 'Mess / Food', 'Library'];
    if (!data.category || !allowedCategories.includes(data.category)) {
        errors.push('Please select a valid complaint category.');
    }

    // 5. Description: Required, minimum 10 characters to prevent spam
    if (!data.description || data.description.trim() === '') {
        errors.push('Complaint description is required.');
    } else if (data.description.trim().length < 10) {
        errors.push('Description is too short. Please provide at least 10 characters.');
    }

    return errors;
}
```

---

## 6. Test Suite & Verification Results

### **6.1 Test Cases Matrix**

| Test Case ID | Test Description | Input Payload | Expected HTTP Code | Expected Outcome | Status |
|---|---|---|:---:|---|:---:|
| **TC-01** | Valid Complaint Submission | Name: "Pooja Hegde"<br>Email: "pooja@campus.edu"<br>Roll: "TY-IT-14"<br>Cat: "Library"<br>Desc: "Air conditioning in reading hall 2 is not functioning." | **`201 Created`** | Success message returned with assigned Ticket ID (e.g., `CC-102`). Record added. | **PASSED** |
| **TC-02** | Invalid Name (Numeric digits) | Name: "P123" | **`400 Bad Request`** | Rejected with error: *"Student Name can only contain letters and spaces."* | **PASSED** |
| **TC-03** | Invalid Email Format | Email: "invalid-email-format" | **`400 Bad Request`** | Rejected with error: *"Please enter a valid email address."* | **PASSED** |
| **TC-04** | Missing Roll Number | Roll: `""` | **`400 Bad Request`** | Rejected with error: *"Roll Number / Student ID is required."* | **PASSED** |
| **TC-05** | Unauthorized Category | Category: "InvalidCategory" | **`400 Bad Request`** | Rejected with error: *"Please select a valid complaint category."* | **PASSED** |
| **TC-06** | Description Too Short (< 10 chars) | Description: "Short" | **`400 Bad Request`** | Rejected with error: *"Description is too short. Please provide at least 10 characters."* | **PASSED** |
| **TC-07** | Fetch Stored Complaints | `GET /complaints` | **`200 OK`** | Returns array of existing registered complaint objects. | **PASSED** |

---

### **6.2 Automated Test Execution Output (`npm test`)**

```powershell
PS C:\Users\ALIEWARE\.gemini\antigravity\scratch\CampusCare> npm test

> campuscare-simple-validation@1.0.0 test
> node test.js

--- STARTING SERVER-SIDE VALIDATION TESTS ---

[TEST 1] Testing with VALID input...
✔ PASSED! HTTP 201 : Complaint successfully submitted and validated by server!

---------------------------------------------

[TEST 2] Testing with INVALID input...
✔ PASSED! HTTP 400 : Server-side validation failed!
Server rejected the following errors:
   - Student Name can only contain letters and spaces.
   - Please enter a valid email address (e.g., student@campus.edu).
   - Roll Number / Student ID is required.
   - Please select a valid complaint category.
   - Description is too short. Please provide at least 10 characters.

--- ALL LAB TESTS COMPLETED SUCCESSFULLY ---
```

---

## 7. How to Execute the Application

### **Step 1: Open Terminal in Project Folder**
```powershell
cd "C:\Users\ALIEWARE\.gemini\antigravity\scratch\CampusCare"
```

### **Step 2: Start the Web Server**
```powershell
npm start
```
*Output: `Server running at http://localhost:5000`*

### **Step 3: Open in Web Browser**
Visit: **`http://localhost:5000`**
1. Click **"Fill Valid"** $\rightarrow$ Click **"Submit Complaint (POST)"** $\rightarrow$ Observe the green success message with generated Ticket ID.
2. Click **"Fill Invalid"** $\rightarrow$ Click **"Submit Complaint (POST)"** $\rightarrow$ Observe the red alert listing each rejected field.

### **Step 4: Execute Automated Test Script**
In a new terminal window:
```powershell
npm test
```

---

## 8. Viva-Voce Questions & Model Answers

### **Q1: What is the difference between Client-Side and Server-Side validation?**
**Answer:**  
Client-side validation happens in the browser before the form is submitted, offering immediate UI feedback. However, it can be bypassed easily. Server-side validation runs on the Node.js server after the request is received. It is the definitive defense against malformed or malicious data.

### **Q2: Which HTTP status codes did you use and why?**
**Answer:**
- **`200 OK`**: Returned for successful `GET` queries.
- **`201 Created`**: Returned for successful `POST` submissions when a new complaint resource is created.
- **`400 Bad Request`**: Returned when the client sends data that fails one or more server validation rules.

### **Q3: What middleware did you use for request handling in Express?**
**Answer:**  
We used `express.json()` to parse JSON request bodies and `express.urlencoded({ extended: true })` for standard form submissions, populating `req.body`.

### **Q4: How does Node.js handle routing?**
**Answer:**  
Express provides HTTP method routing methods such as `app.get(path, handler)` and `app.post(path, handler)` which intercept requests matching the path and method, executing the callback with the `req` and `res` objects.

---

## 9. Conclusion

The individual web application was successfully designed, developed, and evaluated. All instructions specified in the problem statement—including Node.js module usage, HTTP GET/POST handling, request/response processing, server-side data validation, user feedback messaging, and valid/invalid testing—have been fully implemented and verified.
