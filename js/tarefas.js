const listaTarefas = document.getElementById('listaTarefas');

// Ao abrir o site, carregar as tarefas já salvas
const carregarTarefas = async () => {
    try {
        const resposta = await fetch('tarefas.php');
        const tarefas = await resposta.json();
        listaTarefas.innerHTML = '';

        const tarefasPendentes = tarefas.filter(tarefa => !tarefa.concluida);
        const tarefasConcluidas = tarefas.filter(tarefa => tarefa.concluida);

        tarefasPendentes.forEach((tarefa) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="caixa-tarefa">
                    <input type="text" value="${tarefa.titulo}" id="titulo-${tarefa.id}" readonly>
                    <textarea id="descricao-${tarefa.id}" readonly>${tarefa.descricao}</textarea>
                </div>
                <div class="acoes">
                    <button onclick="alternarConclusao(${tarefa.id})">Concluir</button>
                    <button onclick="editarTarefa(${tarefa.id})">Editar</button>
                    <button onclick="excluirTarefa(${tarefa.id})">Excluir</button>
                </div>
            `;
            listaTarefas.appendChild(li);
        });

        tarefasConcluidas.forEach((tarefa) => {
            const li = document.createElement('li');
            li.classList.add('concluida');
            li.innerHTML = `
                <div class="caixa-tarefa">
                    <input type="text" value="${tarefa.titulo}" id="titulo-${tarefa.id}" readonly>
                    <textarea id="descricao-${tarefa.id}" readonly>${tarefa.descricao}</textarea>
                </div>
                <div class="acoes">
                    <button onclick="alternarConclusao(${tarefa.id})">Desmarcar</button>
                    <button onclick="editarTarefa(${tarefa.id})">Editar</button>
                    <button onclick="excluirTarefa(${tarefa.id})">Excluir</button>
                </div>
            `;
            listaTarefas.appendChild(li);
        });
    } catch (erro) {
        console.error('Erro ao carregar as tarefas:', erro);
    }
};

// Criar uma tarefa nova
document.getElementById('btn-criar').addEventListener('click', async () => {
    const titulo = document.getElementById('titulo').value;
    const descricao = document.getElementById('descricao').value;

    if (!titulo) {
        alert('O título é obrigatório.');
        return;
    }

    try {
        await fetch('tarefas.php', {
            method: 'POST',
            body: new URLSearchParams({
                'titulo': titulo,
                'descricao': descricao
            })
        });
        carregarTarefas();
    } catch (erro) {
        console.error('Erro ao criar tarefa:', erro);
    }
});

//Pesquisar tarefas
document.getElementById('btn-pesquisa').addEventListener('click', async () => {
    const pesquisa = document.getElementById('pesquisa').value;

    try {
        const resposta = await fetch(`tarefas.php?pesquisa=${pesquisa}`);
        const tarefas = await resposta.json();
        listaTarefas.innerHTML = '';
        tarefas.forEach((tarefa) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="caixa-tarefa">
                    <strong>${tarefa.titulo}</strong>
                    <p>${tarefa.descricao}</p>
                </div>
                <div class="acoes">
                    <button onclick="alternarConclusao(${tarefa.id})">${tarefa.concluida ? 'Desmarcar' : 'Concluir'}</button>
                    <button onclick="editarTarefa(${tarefa.id})">Editar</button>
                    <button onclick="excluirTarefa(${tarefa.id})">Excluir</button>
                </div>
            `;
            listaTarefas.appendChild(li);
        });
    } catch (erro) {
        console.error('Erro ao pesquisar tarefas:', erro);
    }
});

// Botão de alternar entre o estado de tarefa concluída ou não
window.alternarConclusao = async (id) => {
    try {
        await fetch('tarefas.php', {
            method: 'POST',
            body: new URLSearchParams({
                'id': id,
                'toggle': true
            })
        });
        carregarTarefas();
    } catch (erro) {
        console.error('Erro ao alternar tarefa:', erro);
    }
};

// Editar nome e descrição de uma tarefa já existente
window.editarTarefa = (id) => {
    const campoTitulo = document.getElementById(`titulo-${id}`);
    const campoDescricao = document.getElementById(`descricao-${id}`);
    const somenteLeitura = campoTitulo.readOnly;

    campoTitulo.readOnly = !somenteLeitura;
    campoDescricao.readOnly = !somenteLeitura;

    if (somenteLeitura) {
        campoTitulo.focus();
    } else {
        atualizarTarefa(id, campoTitulo.value, campoDescricao.value);
    }
};

// Atualizar tarefa
const atualizarTarefa = async (id, titulo, descricao) => {
    try {
        await fetch('tarefas.php', {
            method: 'POST',
            body: new URLSearchParams({
                'id': id,
                'titulo': titulo,
                'descricao': descricao
            })
        });
        carregarTarefas();
    } catch (erro) {
        console.error('Erro ao editar tarefa:', erro);
    }
};

// Botão de excluir uma tarefa existente
window.excluirTarefa = async (id) => {
    try {
        await fetch('tarefas.php', {
            method: 'POST',
            body: new URLSearchParams({
                'id': id,
                'delete': true
            })
        });
        carregarTarefas();
    } catch (erro) {
        console.error('Erro ao deletar tarefa:', erro);
    }
};

//Rodar a função de carregar as tarefas ao abrir o site
carregarTarefas();