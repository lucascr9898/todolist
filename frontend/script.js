// frontend/script.js

const API_URL = 'http://localhost:3333/api/tasks';

document.addEventListener('DOMContentLoaded', () => {
    fetchTasks();
    document.getElementById('task-form').addEventListener('submit', addTask);
});

// --- FUNÇÃO 1: FETCH (GET) - LÊ TODAS AS TAREFAS ---
async function fetchTasks() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const tasks = await response.json();
        renderTasks(tasks);
    } catch (error) {
        console.error("Erro ao buscar tarefas:", error);
    }
}

// --- FUNÇÃO 2: RENDERIZAÇÃO NO HTML ---
function renderTasks(tasks) {
    const list = document.getElementById('tasks-list');
    list.innerHTML = ''; // Limpa a lista existente

    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = task.completed ? 'completed' : '';
        li.dataset.id = task.id; // Armazena o ID no elemento

        // Título da tarefa
        const titleSpan = document.createElement('span');
        titleSpan.textContent = task.title;

        // Container para os botões
        const actionsDiv = document.createElement('div');

        // Botão de Concluir/Desconcluir
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'toggle-btn';
        toggleBtn.textContent = task.completed ? 'Desfazer' : 'Concluir';
        toggleBtn.addEventListener('click', () => toggleTask(task.id, !task.completed));

        // Botão de Deletar
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'X';
        deleteBtn.addEventListener('click', () => deleteTask(task.id));

        actionsDiv.appendChild(toggleBtn);
        actionsDiv.appendChild(deleteBtn);
        
        li.appendChild(titleSpan);
        li.appendChild(actionsDiv);
        list.appendChild(li);
    });
}

// --- FUNÇÃO 3: ADD (POST) - CRIA UMA NOVA TAREFA ---
async function addTask(e) {
    e.preventDefault(); // Evita o recarregamento da página
    const titleInput = document.getElementById('task-title');
    const title = titleInput.value.trim();

    if (!title) return;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title })
        });

        if (!response.ok) {
            throw new Error('Falha ao adicionar a tarefa.');
        }

        titleInput.value = ''; // Limpa o input
        fetchTasks(); // Recarrega a lista
    } catch (error) {
        console.error("Erro ao adicionar tarefa:", error);
    }
}

// --- FUNÇÃO 4: TOGGLE (PATCH) - ATUALIZA O STATUS ---
async function toggleTask(id, completedStatus) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ completed: completedStatus })
        });

        if (!response.ok) {
            throw new Error('Falha ao atualizar o status da tarefa.');
        }

        fetchTasks(); // Recarrega a lista
    } catch (error) {
        console.error("Erro ao atualizar tarefa:", error);
    }
}

// --- FUNÇÃO 5: DELETE (DELETE) - EXCLUI UMA TAREFA ---
async function deleteTask(id) {
    if (!confirm('Tem certeza que deseja deletar esta tarefa?')) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (response.status !== 204) { // O 204 No Content é a resposta esperada
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        fetchTasks(); // Recarrega a lista
    } catch (error) {
        console.error("Erro ao deletar tarefa:", error);
    }
}