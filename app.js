let timetableData = {};
let currentMainTab = 't2026';
let currentSubTab = 't2026_b';

// Adatok betöltése induláskor
document.addEventListener("DOMContentLoaded", async () => {
    try {
        let response = await fetch('orarendek.json');
        timetableData = await response.json();
        renderAllTables();
        updateActiveViews();
    } catch (error) {
        console.error("Hiba az órarendek betöltése közben:", error);
    }
});

// Táblázatok generálása DOM-ba
function renderAllTables() {
    const container = document.getElementById('table-container');
    container.innerHTML = '';

    for (const [key, data] of Object.entries(timetableData)) {
        const table = document.createElement('table');
        table.id = key;
        table.className = 'orarend-table';

        // Fejléc
        let theadHTML = `<thead><tr><th class="oraszam-col"></th>`;
        data.napok.forEach(nap => theadHTML += `<th>${nap}</th>`);
        theadHTML += `<th class="oraszam-col"></th></tr></thead>`;

        // Törzs
        let tbodyHTML = `<tbody>`;
        data.orak.forEach((sor, index) => {
            let oraSzam = index + 1;
            tbodyHTML += `<tr><th class="oraszam">${oraSzam}.</th>`;

            sor.forEach(cella => {
                if (cella === null) return; // Ha rowspan miatt ki kell hagyni

                let rowspanAttr = cella.rowspan ? ` rowspan="${cella.rowspan}"` : '';
                tbodyHTML += `<td${rowspanAttr}>
                    <span class="ora">${cella.ora}</span>
                    <span class="terem">${cella.terem || ''}</span>
                </td>`;
            });

            tbodyHTML += `<th class="oraszam">${oraSzam}.</th></tr>`;
        });
        tbodyHTML += `</tbody>`;

        table.innerHTML = theadHTML + tbodyHTML;
        container.appendChild(table);
    }
}

// Főmenü váltás
function switchMainTab(targetId, event) {
    currentMainTab = targetId;
    
    document.querySelectorAll('.tabs .tab-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');

    const subTabs2026 = document.getElementById('sub-tabs-2026');
    if (targetId === 't2026') {
        subTabs2026.style.display = 'flex';
        currentSubTab = 't2026_a';
        
        // Almenü gombok visszaállítása
        document.querySelectorAll('.sub-tab-btn').forEach(b => b.classList.remove('active'));
        subTabs2026.querySelector('.sub-tab-btn').classList.add('active');
    } else {
        subTabs2026.style.display = 'none';
        currentSubTab = targetId;
    }

    updateActiveViews();
}

// Almenü váltás (2026 A/B/C)
function switchSubTab(subTableId, event) {
    currentSubTab = subTableId;
    document.querySelectorAll('.sub-tab-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');

    updateActiveViews();
}

// Aktív táblázat megjelenítése
function updateActiveViews() {
    document.querySelectorAll('.orarend-table').forEach(t => t.classList.remove('active'));
    
    let activeId = (currentMainTab === 't2026') ? currentSubTab : currentMainTab;
    let activeTable = document.getElementById(activeId);
    
    if (activeTable) {
        activeTable.classList.add('active');
    }
}