function loadTasks() {
    fetch('tarefas.php')
        .then(response => response.json())
        .then(tarefas => {
            const listaTarefas = document.getElementById('lista-tarefas');
            listaTarefas.innerHTML = '';

            const pendentes = tarefas.filter(tarefa => !tarefa.concluida);
            const concluidas = tarefas.filter(tarefa => tarefa.concluida);

            pendentes.forEach((tarefa, index) => {
                listaTarefas.innerHTML += createTaskHTML(tarefa, index, false);
            });

            concluidas.forEach((tarefa, index) => {
                listaTarefas.innerHTML += createTaskHTML(tarefa, index, true);
            });
        });
}

function createTaskHTML(tarefa, index, concluida) {
    return `
        <li>
            <input type="checkbox" ${concluida ? 'checked' : ''} onchange="toggleTask(${index})">
            <span ${concluida ? 'style="text-decoration: line-through;"' : ''}>${tarefa.titulo}</span>
            <button onclick="editTask(${index})">Editar</button>
            <button onclick="deleteTask(${index})">Remover</button>
        </li>
    `;
}

document.getElementById('adicionar-tarefa-btn').addEventListener('click', () => {
    const titulo = document.getElementById('titulo-tarefa').value;
    const descricao = document.getElementById('descricao-tarefa').value;

    fetch('tarefas.php', {
        method: 'POST',
        body: new URLSearchParams({ titulo, descricao })
    }).then(loadTasks);
});

function editTask(index) {
    const novoTitulo = prompt('Novo título da tarefa:');
    const novaDescricao = prompt('Nova descrição da tarefa:');

    fetch('tarefas.php', {
        method: 'POST',
        body: new URLSearchParams({ id: index, titulo: novoTitulo, descricao: novaDescricao })
    }).then(loadTasks);
}

function deleteTask(index) {
    fetch(`tarefas.php?id=${index}`, {
        method: 'DELETE'
    }).then(loadTasks);
}

function toggleTask(index) {
    fetch(`tarefas.php`, {
        method: 'PATCH',
        body: new URLSearchParams({ id: index })
    }).then(loadTasks);
}

document.getElementById('pesquisar-tarefa').addEventListener('input', function() {
    const pesquisa = this.value;

    fetch(`tarefas.php?pesquisa=${pesquisa}`)
        .then(response => response.json())
        .then(tarefas => {
            const listaTarefas = document.getElementById('lista-tarefas');
            listaTarefas.innerHTML = '';

            tarefas.forEach((tarefa, index) => {
                listaTarefas.innerHTML += createTaskHTML(tarefa, index, tarefa.concluida);
            });
        });
});

window.onload = loadTasks;
