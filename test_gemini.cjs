const https = require('https');

const apiKey = 'AIzaSyC3iY7EVD3Su7GOkeGEH07y3bUXW2m0kU4';
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

const data = JSON.stringify({
    contents: [{ role: 'user', parts: [{ text: 'Hello' }] }]
});

const req = https.request(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
}, (res) => {
    let body = '';
    res.on('data', d => body += d);
    res.on('end', () => {
        console.log('Status:', res.statusCode);
        console.log('Response:', body);
    });
});
req.write(data);
req.end();
