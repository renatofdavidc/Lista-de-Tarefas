// Função para carregar as tarefas salvas do localStorage
function loadTasks() {
    const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
    const listaTarefas = document.getElementById('lista-tarefas');
    listaTarefas.innerHTML = '';

    tarefas.forEach((tarefa, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <input type="checkbox" ${tarefa.concluida ? 'checked' : ''} onchange="toggleTask(${index})">
            <span ${tarefa.concluida ? 'style="text-decoration: line-through;"' : ''}>${tarefa.tarefa}</span>
            <button onclick="deleteTask(${index})">Remover</button>
            <button onclick="editTask(${index})">Editar</button>
        `;
        listaTarefas.appendChild(li);
    });
}

function addTask() {
    const input = document.getElementById('nova-tarefa');
    const tarefa = input.value;

    if (tarefa.trim() !== '') {
        const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
        tarefas.push({ tarefa: tarefa, concluida: false });
        localStorage.setItem('tarefas', JSON.stringify(tarefas));
        loadTasks(); 
        input.value = ''; 
    } else {
        alert('Por favor, adicione uma tarefa válida.');
    }
}

function editTask(index) {
    const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
    const novaTarefa = prompt('Edite a tarefa:', tarefas[index].tarefa);

    if (novaTarefa !== null && novaTarefa.trim() !== '') {
        tarefas[index].tarefa = novaTarefa;
        localStorage.setItem('tarefas', JSON.stringify(tarefas));
        loadTasks();
    } else {
        alert('Tarefa inválida.');
    }
}

function toggleTask(index) {
    const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
    tarefas[index].concluida = !tarefas[index].concluida;
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
    loadTasks();
}

function deleteTask(index) {
    const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
    tarefas.splice(index, 1);
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
    loadTasks();
}

document.getElementById('adicionar-tarefa-btn').addEventListener('click', addTask);

window.onload = loadTasks;
