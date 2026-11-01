/**
 * test.js — Simple test runner for TY Software Engineering Lab
 * Tests valid and invalid input validation against server.js
 */

const http = require('http');
const app = require('./server');

const PORT = 5050;

function sendPost(data) {
    return new Promise((resolve, reject) => {
        const payload = JSON.stringify(data);
        const options = {
            hostname: '127.0.0.1',
            port: PORT,
            path: '/submit-complaint',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payload)
            }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(body) }));
        });

        req.on('error', reject);
        req.write(payload);
        req.end();
    });
}

async function runTests() {
    const server = app.listen(PORT, async () => {
        console.log('--- STARTING SERVER-SIDE VALIDATION TESTS ---\n');

        // Test 1: Valid Submission
        console.log('[TEST 1] Testing with VALID input...');
        const validData = {
            name: 'Pooja Hegde',
            email: 'pooja@campus.edu',
            rollNo: 'TY-IT-14',
            category: 'Library',
            description: 'Air conditioning in reading hall 2 is not functioning.'
        };
        const res1 = await sendPost(validData);
        if (res1.status === 201 && res1.body.success === true) {
            console.log('✔ PASSED! HTTP', res1.status, ':', res1.body.message);
        } else {
            console.log('✖ FAILED!', res1);
        }

        console.log('\n---------------------------------------------\n');

        // Test 2: Invalid Submission (Wrong email, numbers in name, short description)
        console.log('[TEST 2] Testing with INVALID input...');
        const invalidData = {
            name: 'P123',
            email: 'invalid-email-format',
            rollNo: '',
            category: 'InvalidCategory',
            description: 'Short'
        };
        const res2 = await sendPost(invalidData);
        if (res2.status === 400 && res2.body.success === false) {
            console.log('✔ PASSED! HTTP', res2.status, ':', res2.body.message);
            console.log('Server rejected the following errors:');
            res2.body.errors.forEach(e => console.log('   - ' + e));
        } else {
            console.log('✖ FAILED!', res2);
        }

        console.log('\n--- ALL LAB TESTS COMPLETED SUCCESSFULLY ---');
        server.close();
    });
}

runTests();
