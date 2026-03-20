const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const server = require('./server.js');

// Helper: Format Time Logic
function formatTime(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours > 12 ? hours - 12 : (hours === 0 ? 12 : hours);
    return `${displayHours}:${mins.toString().padStart(2, '0')} ${period}`;
}

// 1. Logic Tests: Time Formatting
test('Time Formatting Logic', (t) => {
    assert.strictEqual(formatTime(600), '10:00 AM', '10:00 AM should format correctly');
    assert.strictEqual(formatTime(720), '12:00 PM', '12:00 PM (noon) should format correctly');
    assert.strictEqual(formatTime(800), '1:20 PM', '1:20 PM should format correctly');
});

// 2. Logic Tests: Schedule Timing
test('Schedule Timing Calculations', (t) => {
    const START_TIME = 10 * 60; // 10:00 AM
    const TALK_DURATION = 60;
    const TRANSITION = 10;
    const LUNCH = 60;

    let currentTime = START_TIME;
    for (let i = 0; i < 3; i++) {
        currentTime += TALK_DURATION;
        if (i < 2) currentTime += TRANSITION;
    }
    assert.strictEqual(currentTime, 800, 'Talk 3 should finish at 1:20 PM (800 mins)');
    currentTime += LUNCH;
    assert.strictEqual(currentTime, 860, 'Lunch should finish at 2:20 PM (860 mins)');
});

// 3. Logic Tests: Search Filtering & Highlighting Logic Simulation
test('Search Filtering & Highlighting Logic', (t) => {
    const mockTalks = [
        { title: 'Scaling React', categories: ['Frontend', 'React'], speakers: ['Sarah Chen', 'Marcus Miller'] },
        { title: 'Cloud Security', categories: ['Backend', 'Security'], speakers: ['David Wu', 'Alex Johnson'] }
    ];

    const filterByQuery = (talks, query) => {
        const lowerQuery = query.toLowerCase();
        return talks.filter(talk => 
            talk.title.toLowerCase().includes(lowerQuery) ||
            talk.categories.some(cat => cat.toLowerCase().includes(lowerQuery)) ||
            talk.speakers.some(speaker => speaker.toLowerCase().includes(lowerQuery))
        );
    };

    function highlightText(text, query) {
        if (!query) return text;
        const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(${escapedQuery})`, 'gi');
        return text.toString().replace(regex, '<span class="highlight">$1</span>');
    }

    assert.strictEqual(filterByQuery(mockTalks, 'front').length, 1, 'Should find 1 Frontend talk');
    assert.strictEqual(filterByQuery(mockTalks, 'Sarah').length, 1, 'Should find talk by speaker name');
    assert.strictEqual(filterByQuery(mockTalks, 'scaling').length, 1, 'Should find talk by title');
    
    // Highlight Verification
    assert.strictEqual(highlightText('Scaling React', 'react'), 'Scaling <span class="highlight">React</span>', 'Should highlight matching text');
    assert.strictEqual(highlightText('Sarah Chen', 'sarah'), '<span class="highlight">Sarah</span> Chen', 'Should be case-insensitive in highlighting');
});

// 4. Data Integrity Tests
test('Data Schema Verification', (t) => {
    const dataPath = path.join(__dirname, 'public/data/talks.json');
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    assert.strictEqual(data.length, 6, 'There must be exactly 6 talks');
    data.forEach((talk, i) => {
        assert.ok(talk.title, `Talk ${i+1} must have a title`);
        assert.ok(talk.speakers.length >= 1 && talk.speakers.length <= 2, `Talk ${i+1} must have 1-2 speakers`);
        assert.ok(talk.categories.length >= 1 && talk.categories.length <= 3, `Talk ${i+1} must have 1-3 categories`);
    });
});

// 5. UI Resource Content Verification
test('UI Resource Integrity', (t) => {
    const html = fs.readFileSync(path.join(__dirname, 'public/index.html'), 'utf8');
    assert.ok(html.includes('id="categorySearch"'), 'index.html must have a search input');
    assert.ok(html.includes('id="schedule"'), 'index.html must have a schedule container');
    assert.ok(html.includes('id="clearSearch"'), 'index.html must have a clear search button');

    const css = fs.readFileSync(path.join(__dirname, 'public/style.css'), 'utf8');
    assert.ok(css.includes('--bg-color: #121212'), 'CSS must define the dark mode background color');
    assert.ok(css.includes('position: sticky'), 'CSS must define a sticky header');
});

// 6. Server Connectivity and Error Handling
test('Server Routing and 404 Handling', async (t) => {
    const PORT = 8082;
    await new Promise((resolve) => server.listen(PORT, resolve));

    const request = (url) => {
        return new Promise((resolve, reject) => {
            http.get(`http://localhost:${PORT}${url}`, (res) => {
                resolve(res.statusCode);
            }).on('error', reject);
        });
    };

    try {
        assert.strictEqual(await request('/'), 200, 'Root should return 200');
        assert.strictEqual(await request('/non-existent-file.txt'), 404, 'Missing file should return 404');
    } finally {
        await new Promise((resolve) => server.close(resolve));
    }
});
