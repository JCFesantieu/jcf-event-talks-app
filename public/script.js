document.addEventListener('DOMContentLoaded', () => {
    const scheduleContainer = document.getElementById('schedule');
    const searchInput = document.getElementById('categorySearch');
    
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

    function renderSchedule(filter = '') {
        scheduleContainer.innerHTML = '';
        let currentTime = START_TIME;
        const lowercaseFilter = filter.toLowerCase();

        talks.forEach((talk, index) => {
            const endTime = currentTime + TALK_DURATION;
            
            // Check if talk matches filter
            const matchesFilter = talk.categories.some(cat => 
                cat.toLowerCase().includes(lowercaseFilter)
            );

            if (matchesFilter || filter === '') {
                // Render Talk
                const talkEl = document.createElement('div');
                talkEl.className = 'item talk';
                talkEl.innerHTML = `
                    <div class="time-row">${formatTime(currentTime)} - ${formatTime(endTime)}</div>
                    <div class="title">${talk.title}</div>
                    <div class="speakers">Speakers: ${talk.speakers.join(', ')}</div>
                    <div class="tags">
                        ${talk.categories.map(cat => `<span class="tag">${cat}</span>`).join('')}
                    </div>
                    <div class="description">${talk.description}</div>
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
            scheduleContainer.innerHTML = '<div class="item">No talks found for this category.</div>';
        }
    }

    searchInput.addEventListener('input', (e) => {
        renderSchedule(e.target.value);
    });

    fetchTalks();
});
