const API = '/api/applications/summary'; // endpoint for dummy hardcoded data

const ModuleLabels = {
    NEW_REGISTRATION: 'New Registration',
    NEW_EDITION: 'New Edition',
    REVISED_REGISTRATION: 'Revised Registration',
    OWNERSHIP: 'Ownership Transfer',
    DISCONTINUATION_OF_PUBLICATION: 'Discontinuation of Publication',
    NEWSPRINT_DECLARATION_AUTHENTICATION: 'Newsprint Declaration Authentication'
};

const StatusLabels = {
    NEW_APPLICATION: 'New Applications (Response awaited from Specified Authority within 60 days window)',
    APPLICATION_RECEIVED_FROM_SA: 'Applications received from Specified Authority with/without comments after 60 days',
    DEFICIENT_AWAITING_PUBLISHER: 'Deficient – Applications Response awaited from publishers',
    UNDER_PROCESS_AT_PRGI: 'Under Process at PRGI (Above ASO Level)',
    APPLICATION_REJECTED: 'Applications Rejected',
    REGISTRATION_GRANTED: 'Registration Granted'
};

const StatusOrder = [
    'NEW_APPLICATION',
    'APPLICATION_RECEIVED_FROM_SA',
    'DEFICIENT_AWAITING_PUBLISHER',
    'UNDER_PROCESS_AT_PRGI',
    'APPLICATION_REJECTED',
    'REGISTRATION_GRANTED'
];

const ModuleOrder = Object.keys(ModuleLabels);

// Build dashboard shell
function buildShell() {
    const container = document.getElementById('modules');
    container.innerHTML = '';
    ModuleOrder.forEach(m => {
        const section = document.createElement('section');
        section.className = `module ${m}`;
        section.innerHTML = `
            <h2>
                <span>${ModuleLabels[m]}</span>
                <span class="toggle-icon">+</span>
            </h2>
            <div class="grid" id="grid-${m}"></div>
        `;
        container.appendChild(section);

        const grid = section.querySelector('.grid');
        StatusOrder.forEach(s => {
            const id = `${m}_${s}`;
            const card = document.createElement('div');
            card.className = `card ${s}`;
            card.id = `card-${id}`;
            card.innerHTML = `
                <div class="status">${StatusLabels[s]}</div>
                <div class="count" id="count-${id}">-</div>
            `;
            grid.appendChild(card);
        });
    });
}

// Load summary from backend
async function loadSummary() {
    try {
        const res = await fetch(API);
        const json = await res.json();
        ModuleOrder.forEach(m => {
            StatusOrder.forEach(s => {
                const cnt = json?.[ModuleLabels[m]]?.[StatusLabels[s]] ?? 0;
                document.getElementById(`count-${m}_${s}`).textContent = cnt;
            });
        });
    } catch (err) {
        console.error('Failed to load summary:', err);
    }
}

// ✅ Excel Export
function exportToExcel() {
    const wb = XLSX.utils.book_new();

    const ws_data = [
        [
            "S.No.",
            "Nature of Application",
            "New Applications (Response awaited from Specified Authority within 60 days window)",
            "Applications received from Specified Authority with/without comments after 60 days",
            "Deficient – Applications Response awaited from publishers",
            "Under Process at PRGI (Above ASO Level)",
            "Applications Rejected",
            "Registration Granted"
        ]
    ];

    let serial = 1;
    ModuleOrder.forEach(m => {
        const row = [
            serial,
            ModuleLabels[m],
            document.getElementById(`count-${m}_NEW_APPLICATION`)?.textContent || "0",
            document.getElementById(`count-${m}_APPLICATION_RECEIVED_FROM_SA`)?.textContent || "0",
            document.getElementById(`count-${m}_DEFICIENT_AWAITING_PUBLISHER`)?.textContent || "0",
            document.getElementById(`count-${m}_UNDER_PROCESS_AT_PRGI`)?.textContent || "0",
            document.getElementById(`count-${m}_APPLICATION_REJECTED`)?.textContent || "0",
            document.getElementById(`count-${m}_REGISTRATION_GRANTED`)?.textContent || "0"
        ];
        ws_data.push(row);
        serial++;
    });

    ws_data.push(["Total", "", "", "", "", "", "", ""]);

    const ws = XLSX.utils.aoa_to_sheet(ws_data);

    ws["!cols"] = [
        { wch: 6 },
        { wch: 40 },
        { wch: 55 },
        { wch: 55 },
        { wch: 40 },
        { wch: 35 },
        { wch: 25 },
        { wch: 25 }
    ];

    Object.keys(ws).forEach(cell => {
        if (cell[0] === '!') return;
        if (!ws[cell].s) ws[cell].s = {};
        ws[cell].s.alignment = { horizontal: "center", vertical: "center", wrapText: true };
    });

    XLSX.utils.book_append_sheet(wb, ws, "Application Status Report");
    XLSX.writeFile(wb, "Application_Status_Report.xlsx");
}

// ✅ Apply + Excel button logic + Collapse for mobile
document.addEventListener('DOMContentLoaded', () => {
    buildShell(); // render modules

    const applyBtn = document.getElementById('btnApply');
    const excelBtn = document.getElementById('btnExcel');

    // Attach collapse logic AFTER buildShell
    function setupCollapse() {
        const modules = document.querySelectorAll('.module');

        if (window.innerWidth <= 767) {
            // Mobile: collapsed by default
            modules.forEach(mod => {
                mod.classList.remove('open'); // start collapsed
                const header = mod.querySelector('h2');
                const icon = header.querySelector('.toggle-icon');
                if (icon) icon.textContent = "+";

                header.onclick = () => {
                    mod.classList.toggle('open'); // toggle expand
                    const icon = header.querySelector('.toggle-icon');
                    if (mod.classList.contains('open')) {
                        icon.textContent = "–"; // expanded
                    } else {
                        icon.textContent = "+"; // collapsed
                    }
                };
            });
        } else {
            // Desktop: always expanded
            modules.forEach(mod => {
                mod.classList.add('open');
                const icon = mod.querySelector('.toggle-icon');
                if (icon) icon.style.display = "none";
            });
        }
    }

    setupCollapse(); // run once on load
    window.addEventListener('resize', setupCollapse); // re-run on resize

    if (applyBtn) {
        applyBtn.addEventListener('click', () => {
            loadSummary().then(() => {
                excelBtn.style.display = "inline-block";
            });
        });
    }

    if (excelBtn) {
        excelBtn.addEventListener('click', exportToExcel);
    }
});
