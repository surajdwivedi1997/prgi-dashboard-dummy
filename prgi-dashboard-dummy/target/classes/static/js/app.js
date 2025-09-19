const API = '/api/applications/summary'; // endpoint for dummy hardcoded data

// Build dashboard dynamically from backend JSON
async function loadSummary() {
    try {
        const res = await fetch(API);
        const json = await res.json();

        const container = document.getElementById('modules');
        container.innerHTML = ''; // clear old content

        // Loop through modules (e.g., New Registration, New Edition)
        Object.keys(json).forEach(moduleName => {
            const section = document.createElement('section');
            section.className = `module`;
            section.innerHTML = `
                <h2>${moduleName}</h2>
                <div class="grid" id="grid-${moduleName.replace(/\s+/g, '_')}"></div>
            `;
            container.appendChild(section);

            const grid = section.querySelector('.grid');

            // Loop through statuses inside each module
            Object.entries(json[moduleName]).forEach(([statusName, value]) => {
                const safeId = `${moduleName}_${statusName}`.replace(/\s+/g, '_');
                const card = document.createElement('div');
                card.className = `card`;
                card.id = `card-${safeId}`;
                card.innerHTML = `
                    <div class="status">${statusName}</div>
                    <div class="count">${value}</div>
                `;
                grid.appendChild(card);
            });
        });
    } catch (err) {
        console.error('Failed to load summary:', err);
    }
}

// ✅ Apply button logic
document.addEventListener('DOMContentLoaded', () => {
    const applyBtn = document.getElementById('btnApply');
    if (applyBtn) {
        applyBtn.addEventListener('click', () => {
            loadSummary(); // fetch & render when Apply is clicked
        });
    }
});