
// No need to import node-fetch, using native fetch

const KEY = "AIzaSyCihZOmfmnM1hDIJxgwtEUZP2fXxfXHIcg";
const URL = `https://generativelanguage.googleapis.com/v1/models?key=${KEY}`;

async function test() {
    try {
        const response = await fetch(URL, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        console.log("Status:", response.status);
        console.log("Body:", JSON.stringify(data, null, 2));
    } catch (e) {
        console.error("Error:", e);
    }
}

test();
