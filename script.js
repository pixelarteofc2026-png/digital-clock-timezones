// Timezone data
const TIMEZONES = [
    { name: 'New York', tz: 'America/New_York', city: 'New York, USA' },
    { name: 'London', tz: 'Europe/London', city: 'London, UK' },
    { name: 'Paris', tz: 'Europe/Paris', city: 'Paris, France' },
    { name: 'Tokyo', tz: 'Asia/Tokyo', city: 'Tokyo, Japan' },
    { name: 'Sydney', tz: 'Australia/Sydney', city: 'Sydney, Australia' },
    { name: 'Dubai', tz: 'Asia/Dubai', city: 'Dubai, UAE' },
    { name: 'Hong Kong', tz: 'Asia/Hong_Kong', city: 'Hong Kong' },
    { name: 'Singapore', tz: 'Asia/Singapore', city: 'Singapore' },
    { name: 'Bangkok', tz: 'Asia/Bangkok', city: 'Bangkok, Thailand' },
    { name: 'Mumbai', tz: 'Asia/Kolkata', city: 'Mumbai, India' },
    { name: 'São Paulo', tz: 'America/Sao_Paulo', city: 'São Paulo, Brazil' },
    { name: 'Mexico City', tz: 'America/Mexico_City', city: 'Mexico City, Mexico' },
    { name: 'Los Angeles', tz: 'America/Los_Angeles', city: 'Los Angeles, USA' },
    { name: 'Toronto', tz: 'America/Toronto', city: 'Toronto, Canada' },
    { name: 'Moscow', tz: 'Europe/Moscow', city: 'Moscow, Russia' },
    { name: 'Berlin', tz: 'Europe/Berlin', city: 'Berlin, Germany' },
    { name: 'Istanbul', tz: 'Europe/Istanbul', city: 'Istanbul, Turkey' },
    { name: 'Bangkok', tz: 'Asia/Bangkok', city: 'Bangkok, Thailand' },
    { name: 'Seoul', tz: 'Asia/Seoul', city: 'Seoul, South Korea' },
    { name: 'Bangkok', tz: 'Asia/Bangkok', city: 'Bangkok, Thailand' },
    { name: 'Auckland', tz: 'Pacific/Auckland', city: 'Auckland, New Zealand' },
    { name: 'Fiji', tz: 'Pacific/Fiji', city: 'Fiji' },
    { name: 'Honolulu', tz: 'Pacific/Honolulu', city: 'Honolulu, USA' },
    { name: 'Anchorage', tz: 'America/Anchorage', city: 'Anchorage, USA' },
    { name: 'Johannesburg', tz: 'Africa/Johannesburg', city: 'Johannesburg, South Africa' },
    { name: 'Cairo', tz: 'Africa/Cairo', city: 'Cairo, Egypt' },
];

const DEFAULT_TIMEZONES = ['America/New_York', 'Europe/London', 'Asia/Tokyo', 'Australia/Sydney'];

let activeClocksData = [];

// Initialize
window.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    loadActiveClocksFromStorage();
    populateTimezoneSelect();
    setupEventListeners();
    renderClocks();
    updateClocks();
    setInterval(updateClocks, 1000);
}

function populateTimezoneSelect() {
    const select = document.getElementById('timezoneSelect');
    TIMEZONES.forEach(tz => {
        const option = document.createElement('option');
        option.value = tz.tz;
        option.textContent = `${tz.name} - ${tz.city}`;
        select.appendChild(option);
    });
}

function setupEventListeners() {
    document.getElementById('addTimezoneBtn').addEventListener('click', addTimezone);
    document.getElementById('resetBtn').addEventListener('click', resetToDefault);
    document.getElementById('timezoneSelect').addEventListener('change', addTimezoneFromSelect);
    document.getElementById('searchInput').addEventListener('input', handleSearch);
}

function addTimezone() {
    const select = document.getElementById('timezoneSelect');
    const tzValue = select.value;
    
    if (!tzValue) {
        alert('Please select a timezone');
        return;
    }
    
    if (activeClocksData.some(c => c.tz === tzValue)) {
        alert('This timezone is already added');
        return;
    }
    
    const tzData = TIMEZONES.find(t => t.tz === tzValue);
    activeClocksData.push(tzData);
    saveActiveClocksToStorage();
    renderClocks();
    select.value = '';
}

function addTimezoneFromSelect() {
    addTimezone();
}

function removeTimezone(tz) {
    activeClocksData = activeClocksData.filter(c => c.tz !== tz);
    saveActiveClocksToStorage();
    renderClocks();
}

function resetToDefault() {
    const defaultTzs = TIMEZONES.filter(t => DEFAULT_TIMEZONES.includes(t.tz));
    activeClocksData = defaultTzs;
    saveActiveClocksToStorage();
    renderClocks();
}

function saveActiveClocksToStorage() {
    localStorage.setItem('activeClocksData', JSON.stringify(activeClocksData));
}

function loadActiveClocksFromStorage() {
    const stored = localStorage.getItem('activeClocksData');
    if (stored) {
        try {
            activeClocksData = JSON.parse(stored);
        } catch (e) {
            activeClocksData = TIMEZONES.filter(t => DEFAULT_TIMEZONES.includes(t.tz));
        }
    } else {
        activeClocksData = TIMEZONES.filter(t => DEFAULT_TIMEZONES.includes(t.tz));
    }
}

function renderClocks() {
    const container = document.getElementById('clocksContainer');
    
    if (activeClocksData.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1;" class="empty-state">
                <h2>No timezones added yet</h2>
                <p>Select a timezone from the dropdown above to get started</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = activeClocksData.map(tz => `
        <div class="clock-card">
            <div class="clock-header">
                <div>
                    <div class="timezone-name">${tz.name}</div>
                    <div style="font-size: 0.9rem; color: var(--secondary-color); margin-top: 4px;">${tz.city}</div>
                </div>
                <div style="display: flex; gap: 10px; align-items: center;">
                    <div class="timezone-offset" id="offset-${tz.tz}">UTC</div>
                    <button class="remove-btn" onclick="removeTimezone('${tz.tz}')" title="Remove timezone">×</button>
                </div>
            </div>
            
            <div class="digital-time" id="time-${tz.tz}">00:00:00</div>
            
            <div class="time-info">
                <div class="info-item">
                    <div class="info-label">Date</div>
                    <div class="info-value" id="date-${tz.tz}">--/--/--</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Day</div>
                    <div class="info-value" id="day-${tz.tz}">--</div>
                </div>
            </div>
            
            <div style="text-align: center;">
                <span class="day-indicator" id="period-${tz.tz}">AM</span>
            </div>
            
            <div class="analog-clock">
                <div class="clock-circle" id="analog-${tz.tz}">
                    <div class="clock-center"></div>
                    <div class="hand hour-hand" id="hour-${tz.tz}"></div>
                    <div class="hand minute-hand" id="minute-${tz.tz}"></div>
                    <div class="hand second-hand" id="second-${tz.tz}"></div>
                </div>
            </div>
        </div>
    `).join('');
}

function updateClocks() {
    activeClocksData.forEach(tz => {
        const now = new Date();
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: tz.tz,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
        
        const formatterDate = new Intl.DateTimeFormat('en-US', {
            timeZone: tz.tz,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            weekday: 'long'
        });
        
        const timeStr = formatter.format(now);
        const dateStr = formatterDate.format(now);
        const [day, date, year] = dateStr.split(', ').reverse();
        const weekday = dateStr.split(', ')[0];
        
        // Update digital time
        const timeElement = document.getElementById(`time-${tz.tz}`);
        if (timeElement) timeElement.textContent = timeStr;
        
        // Update date
        const dateElement = document.getElementById(`date-${tz.tz}`);
        if (dateElement) dateElement.textContent = `${dateStr.split(', ')[2]}`;
        
        // Update day
        const dayElement = document.getElementById(`day-${tz.tz}`);
        if (dayElement) dayElement.textContent = weekday;
        
        // Update period (AM/PM)
        const [hours, minutes, seconds] = timeStr.split(':').map(Number);
        const periodElement = document.getElementById(`period-${tz.tz}`);
        if (periodElement) periodElement.textContent = hours >= 12 ? 'PM' : 'AM';
        
        // Update analog clock
        updateAnalogClock(tz.tz, hours, minutes, seconds);
        
        // Update offset
        updateTimezoneOffset(tz.tz, now);
    });
}

function updateTimezoneOffset(tz, now) {
    const offsetElement = document.getElementById(`offset-${tz}`);
    if (!offsetElement) return;
    
    const tzDate = new Date(now.toLocaleString('en-US', { timeZone: tz }));
    const offset = (now - tzDate) / (1000 * 60 * 60);
    const sign = offset >= 0 ? '+' : '-';
    const absOffset = Math.abs(offset);
    const hours = Math.floor(absOffset);
    const minutes = (absOffset % 1) * 60;
    
    offsetElement.textContent = `UTC${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

function updateAnalogClock(tz, hours, minutes, seconds) {
    const hourHand = document.getElementById(`hour-${tz}`);
    const minuteHand = document.getElementById(`minute-${tz}`);
    const secondHand = document.getElementById(`second-${tz}`);
    
    if (!hourHand || !minuteHand || !secondHand) return;
    
    // Calculate angles
    const secondAngle = (seconds / 60) * 360;
    const minuteAngle = (minutes / 60) * 360 + (seconds / 60 / 60) * 360;
    const hourAngle = ((hours % 12) / 12) * 360 + (minutes / 60 / 12) * 360;
    
    // Apply rotations
    hourHand.style.transform = `rotate(${hourAngle}deg)`;
    minuteHand.style.transform = `rotate(${minuteAngle}deg)`;
    secondHand.style.transform = `rotate(${secondAngle}deg)`;
}

function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const select = document.getElementById('timezoneSelect');
    
    const options = select.querySelectorAll('option');
    options.forEach(option => {
        if (option.value === '') {
            option.style.display = 'block';
            return;
        }
        const matches = option.textContent.toLowerCase().includes(searchTerm);
        option.style.display = matches ? 'block' : 'none';
    });
    
    // Highlight matching options by moving them to the top
    const matched = Array.from(options).filter(opt => opt.style.display !== 'none');
    if (matched.length > 0) {
        select.value = matched[0].value;
    }
}
