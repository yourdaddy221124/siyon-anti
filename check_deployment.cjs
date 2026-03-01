const https = require('https');

https.get('https://mindease1-steel.vercel.app/', (res) => {
    let html = '';
    res.on('data', d => html += d);
    res.on('end', () => {
        const match = html.match(/src="(\/assets\/index-[^"]+\.js)"/);
        if (!match) return console.log('Could not find JS file');

        const jsUrl = 'https://mindease1-steel.vercel.app' + match[1];
        https.get(jsUrl, (res2) => {
            let js = '';
            res2.on('data', d => js += d);
            res2.on('end', () => {
                const convexMatch = js.match(/https:\/\/[^\.]+\.convex\.cloud/);
                console.log('--- DEPLOYED VERCEL ASSET ANALYSIS ---');
                console.log('Convex URL injected:', convexMatch ? convexMatch[0] : 'MISSING');
                console.log('Gemini AIzaSy Key injected:', js.includes('AIzaSy') ? 'YES' : 'NO');

                // Let's also check if it's hitting the specific prod or dev URL
                if (convexMatch) {
                    if (convexMatch[0].includes('quirky-wren-509')) console.log('✅ Pointing to PRODUCTION Convex Database');
                    else if (convexMatch[0].includes('decisive-cat-101')) console.log('❌ Pointing to DEVELOPMENT Convex Database');
                }
            });
        });
    });
});
