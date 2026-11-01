/**
 * server.js — CampusCare Server-Side Validation Demo
 * Subject: Web Technology Lab / Mini Project
 * Class: Third Year (TY) Software Engineering
 *
 * Concepts demonstrated:
 * 1. NodeJS Modules (express, path)
 * 2. Routing (app.get, app.post)
 * 3. Request & Response handling (req.body, res.status, res.json)
 * 4. Server-Side Input Validation (checking inputs before processing)
 */

const express = require('express');
const path = require('path');

const app = express();
const PORT = 5000;

// Middleware to parse JSON and URL-encoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend files from "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// In-memory array to store complaints (no complex database needed for lab demo)
let complaints = [
    {
        ticketId: 'CC-101',
        name: 'Rahul Sharma',
        email: 'rahul@campus.edu',
        rollNo: 'TY-CS-45',
        category: 'Hostel',
        description: 'Wi-Fi router on 3rd floor is not working properly.',
        date: new Date().toLocaleDateString()
    }
];

// Helper: Server-side validation function
function validateComplaintInput(data) {
    const errors = [];

    // 1. Name validation
    if (!data.name || data.name.trim() === '') {
        errors.push('Student Name is required.');
    } else if (data.name.trim().length < 3) {
        errors.push('Student Name must have at least 3 characters.');
    } else if (!/^[A-Za-z\s]+$/.test(data.name.trim())) {
        errors.push('Student Name can only contain letters and spaces.');
    }

    // 2. Email validation using simple regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || data.email.trim() === '') {
        errors.push('Email is required.');
    } else if (!emailRegex.test(data.email.trim())) {
        errors.push('Please enter a valid email address (e.g., student@campus.edu).');
    }

    // 3. Roll Number validation
    if (!data.rollNo || data.rollNo.trim() === '') {
        errors.push('Roll Number / Student ID is required.');
    }

    // 4. Category validation
    const allowedCategories = ['Hostel', 'Academic', 'Infrastructure', 'Mess / Food', 'Library'];
    if (!data.category || !allowedCategories.includes(data.category)) {
        errors.push('Please select a valid complaint category.');
    }

    // 5. Description validation (min 10 characters)
    if (!data.description || data.description.trim() === '') {
        errors.push('Complaint description is required.');
    } else if (data.description.trim().length < 10) {
        errors.push('Description is too short. Please provide at least 10 characters.');
    }

    return errors;
}

// ==========================================
// ROUTES (Routing & Request/Response Handling)
// ==========================================

// Route 1: GET / — Serves the homepage form
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route 2: GET /complaints — Fetch all registered complaints
app.get('/complaints', (req, res) => {
    res.status(200).json({
        success: true,
        data: complaints
    });
});

// Route 3: POST /submit-complaint — Server-Side Validation & Submission
app.post('/submit-complaint', (req, res) => {
    const { name, email, rollNo, category, description } = req.body;

    // Run Server-Side Validation
    const validationErrors = validateComplaintInput({ name, email, rollNo, category, description });

    // If validation fails -> Return HTTP 400 Bad Request with error list
    if (validationErrors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Server-side validation failed!',
            errors: validationErrors
        });
    }

    // If validation passes -> Return HTTP 201 Created with success message
    const newComplaint = {
        ticketId: 'CC-' + (100 + complaints.length + 1),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        rollNo: rollNo.trim(),
        category,
        description: description.trim(),
        date: new Date().toLocaleDateString()
    };

    complaints.unshift(newComplaint);

    return res.status(201).json({
        success: true,
        message: 'Complaint successfully submitted and validated by server!',
        ticketId: newComplaint.ticketId,
        complaint: newComplaint
    });
});

// Start the server
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
}

module.exports = app;
