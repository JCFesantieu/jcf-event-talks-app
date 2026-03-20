document.addEventListener('DOMContentLoaded', () => {
    const scheduleContainer = document.getElementById('schedule');
    const searchInput = document.getElementById('categorySearch');
    const clearBtn = document.getElementById('clearSearch');
    
    let talks = [];

    // Configuration
    const START_TIME = 10 * 60; // 10:00 AM in minutes
    const TALK_DURATION = 60; // 1 hour
    const TRANSITION_DURATION = 10; // 10 minutes
    const LUNCH_DURATION = 60; // 1 hour

    async function fetchTalks() {
        try {
            const response = await fetch('/data/talks.json');
            talks = await response.json();
            renderSchedule();
        } catch (error) {
            console.error('Error fetching talks:', error);
            scheduleContainer.innerHTML = '<div class="item">Error loading talks. Please try again.</div>';
        }
    }

    function formatTime(totalMinutes) {
        const hours = Math.floor(totalMinutes / 60);
        const mins = totalMinutes % 60;
        const period = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours > 12 ? hours - 12 : (hours === 0 ? 12 : hours);
        return `${displayHours}:${mins.toString().padStart(2, '0')} ${period}`;
    }

    function highlightText(text, query) {
        if (!query) return text;
        const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(${escapedQuery})`, 'gi');
        return text.toString().replace(regex, '<span class="highlight">$1</span>');
    }

    function generateCalendarUrl(talk, startTimeMins, endTimeMins) {
        const year = 2026;
        const month = "03";
        const day = "20";
        
        const toISO = (mins) => {
            const h = Math.floor(mins / 60).toString().padStart(2, '0');
            const m = (mins % 60).toString().padStart(2, '0');
            return `${year}${month}${day}T${h}${m}00Z`; // UTC for simplicity in this example
        };

        const start = toISO(startTimeMins);
        const end = toISO(endTimeMins);
        const title = encodeURIComponent(`TechTalks: ${talk.title}`);
        const details = encodeURIComponent(`${talk.description}\n\nSpeakers: ${talk.speakers.join(', ')}`);
        
        return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=Main+Track`;
    }

    function renderSchedule(filter = '') {
        scheduleContainer.innerHTML = '';
        let currentTime = START_TIME;
        const lowercaseFilter = filter.toLowerCase();

        // Toggle clear button
        if (filter) {
            clearBtn.classList.remove('hidden');
        } else {
            clearBtn.classList.add('hidden');
        }

        talks.forEach((talk, index) => {
            const endTime = currentTime + TALK_DURATION;
            
            // Check if talk matches filter (by title, category, OR speaker)
            const matchesTitle = talk.title.toLowerCase().includes(lowercaseFilter);
            const matchesCategory = talk.categories.some(cat => 
                cat.toLowerCase().includes(lowercaseFilter)
            );
            const matchesSpeaker = talk.speakers.some(speaker => 
                speaker.toLowerCase().includes(lowercaseFilter)
            );

            if (matchesTitle || matchesCategory || matchesSpeaker || filter === '') {
                // Render Talk
                const talkEl = document.createElement('div');
                talkEl.className = 'item talk';
                const calUrl = generateCalendarUrl(talk, currentTime, endTime);
                
                talkEl.innerHTML = `
                    <div class="time-row">${formatTime(currentTime)} - ${formatTime(endTime)}</div>
                    <div class="title">${highlightText(talk.title, filter)}</div>
                    <div class="speakers">Speakers: ${highlightText(talk.speakers.join(', '), filter)}</div>
                    <div class="tags">
                        ${talk.categories.map(cat => `<span class="tag" data-category="${cat}">${highlightText(cat, filter)}</span>`).join('')}
                    </div>
                    <div class="description">${highlightText(talk.description, filter)}</div>
                    <div class="actions">
                        <a href="${calUrl}" target="_blank" class="calendar-link">📅 Add to Google Calendar</a>
                    </div>
                `;
                scheduleContainer.appendChild(talkEl);
            }

            currentTime = endTime;

            // Handle Transitions and Lunch
            const isLastTalk = index === talks.length - 1;
            const isBeforeLunch = index === 2; // Lunch after 3rd talk

            if (!isLastTalk) {
                if (isBeforeLunch) {
                    // Render Lunch
                    const lunchEnd = currentTime + LUNCH_DURATION;
                    const lunchEl = document.createElement('div');
                    lunchEl.className = `item lunch ${filter ? 'hidden' : ''}`;
                    lunchEl.innerHTML = `
                        <div class="time-row">${formatTime(currentTime)} - ${formatTime(lunchEnd)}</div>
                        <div class="title">🍱 Lunch Break</div>
                        <div class="description">Time to refuel and network.</div>
                    `;
                    scheduleContainer.appendChild(lunchEl);
                    currentTime = lunchEnd;
                } else {
                    // Render Transition
                    const transEnd = currentTime + TRANSITION_DURATION;
                    const transEl = document.createElement('div');
                    transEl.className = `item transition ${filter ? 'hidden' : ''}`;
                    transEl.innerHTML = `
                        <div class="time-row">${formatTime(currentTime)} - ${formatTime(transEnd)}</div>
                        <div class="description">🔄 Transition & Room Change</div>
                    `;
                    scheduleContainer.appendChild(transEl);
                    currentTime = transEnd;
                }
            }
        });

        if (scheduleContainer.innerHTML === '') {
            const emptyEl = document.createElement('div');
            emptyEl.className = 'no-results';
            emptyEl.innerHTML = `
                <h2>No talks found</h2>
                <p>We couldn't find any talks matching "<strong>${filter}</strong>".</p>
                <button class="btn-primary" onclick="resetSearch()">View Full Schedule</button>
            `;
            scheduleContainer.appendChild(emptyEl);
        }

        // Add listeners to tags
        document.querySelectorAll('.tag').forEach(tag => {
            tag.addEventListener('click', () => {
                const category = tag.getAttribute('data-category');
                searchInput.value = category;
                renderSchedule(category);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        });
    }

    window.resetSearch = () => {
        searchInput.value = '';
        renderSchedule('');
    };

    searchInput.addEventListener('input', (e) => {
        renderSchedule(e.target.value);
    });

    clearBtn.addEventListener('click', resetSearch);

    fetchTalks();
});
