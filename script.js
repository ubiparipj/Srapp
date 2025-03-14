let currentUser = {
    username: 'user',
    tasks: [],
    goals: [],
    notes: []
};

// Inicijalizacija
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    showSection('todo');
    initMotivation();
});

// Podaci i spremanje
function loadData() {
    const savedData = localStorage.getItem('taskOrganizerData');
    if(savedData) {
        currentUser = JSON.parse(savedData);
    }
    renderTodo();
    renderGoals();
    loadNote();
}

function saveData() {
    localStorage.setItem('taskOrganizerData', JSON.stringify(currentUser));
}

// To-Do funkcionalnosti
function addTodo() {
    const input = document.getElementById('todo-input');
    if(input.value.trim()) {
        currentUser.tasks.push({
            id: Date.now(),
            text: input.value.trim(),
            completed: false,
            date: new Date().toISOString()
        });
        input.value = '';
        saveData();
        renderTodo();
    }
}

function renderTodo() {
    const container = document.getElementById('todo-list');
    container.innerHTML = currentUser.tasks.map(task => `
        <div class="task-item">
            <input type="checkbox" ${task.completed ? 'checked' : ''} 
                   onchange="toggleTodo(${task.id})" class="me-3">
            <span class="flex-grow-1 ${task.completed ? 'text-muted' : ''}">
                ${task.text}
            </span>
            <button class="btn btn-sm btn-danger" onclick="deleteTodo(${task.id})">
                Obriši
            </button>
        </div>
    `).join('');
}

function toggleTodo(id) {
    const task = currentUser.tasks.find(t => t.id === id);
    if(task) task.completed = !task.completed;
    saveData();
    renderTodo();
}

function deleteTodo(id) {
    currentUser.tasks = currentUser.tasks.filter(t => t.id !== id);
    saveData();
    renderTodo();
}

// Ciljevi funkcionalnosti
function addGoal() {
    const textInput = document.getElementById('goal-input');
    const dateInput = document.getElementById('goal-date');
    
    if(textInput.value.trim()) {
        currentUser.goals.push({
            id: Date.now(),
            text: textInput.value.trim(),
            date: dateInput.value,
            subgoals: [],
            completed: false
        });
        textInput.value = '';
        saveData();
        renderGoals();
    }
}

function renderGoals() {
    const container = document.getElementById('goals-list');
    container.innerHTML = currentUser.goals.map(goal => `
        <div class="task-item mb-3">
            <div class="d-flex align-items-center w-100">
                <input type="checkbox" ${goal.completed ? 'checked' : ''} 
                       onchange="toggleGoal(${goal.id})" class="me-3">
                <div class="flex-grow-1">
                    <div class="fw-bold">${goal.text}</div>
                    <small>Rok: ${goal.date}</small>
                </div>
                <button class="btn btn-sm btn-danger" 
                        onclick="deleteGoal(${goal.id})">
                    Obriši
                </button>
            </div>
            ${renderSubgoals(goal)}
        </div>
    `).join('');
}

function renderSubgoals(goal) {
    return goal.subgoals.map(sub => `
        <div class="subgoal ms-4 mt-2">
            <input type="checkbox" ${sub.completed ? 'checked' : ''}
                   onchange="toggleSubgoal(${goal.id}, ${sub.id})">
            <span>${sub.text}</span>
        </div>
    `).join('');
}

function deleteGoal(id) {
    currentUser.goals = currentUser.goals.filter(g => g.id !== id);
    saveData();
    renderGoals();
}

// Bilješke funkcionalnosti
function saveNote() {
    currentUser.notes = [{
        content: document.getElementById('note-content').value,
        date: new Date().toISOString()
    }];
    saveData();
}

function loadNote() {
    if(currentUser.notes.length > 0) {
        document.getElementById('note-content').value = currentUser.notes[0].content;
    }
}

async function exportToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    doc.text(document.getElementById('note-content').value, 10, 10);
    doc.save('biljeska.pdf');
}

// Motivacija
function initMotivation() {
    const quotes = [
        {text: "Budnost je put ka životnoj ravnoteži.", author: "Sistem"},
        {text: "Svaki mali korak vodi ka velikom cilju.", author: "Sistem"}
    ];
    
    let currentQuote = 0;
    showQuote(quotes[currentQuote]);
    
    setInterval(() => {
        currentQuote = (currentQuote + 1) % quotes.length;
        showQuote(quotes[currentQuote]);
    }, 120000);
}

function showQuote(quote) {
    const display = document.getElementById('quote-display');
    display.innerHTML = `
        <div class="quote-text">"${quote.text}"</div>
        <div class="quote-author">- ${quote.author}</div>
    `;
}

function handleReaction(type) {
    alert(`Hvala na vašoj reakciji (${type})!`);
}

// PDF preglednik
document.getElementById('pdf-input').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if(file.type === "application/pdf") {
        const reader = new FileReader();
        reader.onload = function() {
            const pdfViewer = document.getElementById('pdf-viewer');
            pdfViewer.innerHTML = `
                <embed src="${reader.result}" 
                       type="application/pdf" 
                       width="100%" 
                       height="100%">
            `;
        };
        reader.readAsDataURL(file);
    }
});

// Pomoćne funkcije
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(el => el.classList.add('d-none'));
    document.getElementById(`${sectionId}-section`).classList.remove('d-none');
}
