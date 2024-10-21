<?php

$arquivo = 'tarefas.json';

// Se o arquivo JSON não existir, criar um novo
if (file_exists($arquivo)) {
    $tarefas = json_decode(file_get_contents($arquivo), true);
} else {
    $tarefas = [];
}

// Gerar um novo ID único para cada tarefa
function gerarId($tarefas) {
    $ids = array_column($tarefas, 'id');
    return $ids ? max($ids) + 1 : 1;
}

// Listar ou pesquisar tarefas
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['pesquisa'])) {
        $pesquisa = strtolower($_GET['pesquisa']);
        $resultados = array_filter($tarefas, function($tarefa) use ($pesquisa) {
            return strpos(strtolower($tarefa['titulo']), $pesquisa) !== false;
        });
        echo json_encode(array_values($resultados));
    } else {
        echo json_encode($tarefas);
    }
    exit;
}

// Criar, atualizar ou excluir tarefas
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['titulo']) && !isset($_POST['id'])) {
        $novaTarefa = [
            'id' => gerarId($tarefas),
            'titulo' => $_POST['titulo'],
            'descricao' => $_POST['descricao'] ?? '',
            'concluida' => false
        ];
        $tarefas[] = $novaTarefa;
    }

    if (isset($_POST['id']) && isset($_POST['toggle'])) {
        $id = (int) $_POST['id'];
        foreach ($tarefas as &$tarefa) {
            if ($tarefa['id'] === $id) {
                $tarefa['concluida'] = !$tarefa['concluida'];
                break;
            }
        }
    }

    if (isset($_POST['id']) && isset($_POST['titulo'])) {
        $id = (int) $_POST['id'];
        foreach ($tarefas as &$tarefa) {
            if ($tarefa['id'] === $id) {
                $tarefa['titulo'] = $_POST['titulo'];
                $tarefa['descricao'] = $_POST['descricao'];
                break;
            }
        }
    }

    if (isset($_POST['id']) && isset($_POST['delete'])) {
        $id = (int) $_POST['id'];
        $tarefas = array_filter($tarefas, function($tarefa) use ($id) {
            return $tarefa['id'] !== $id;
        });
        $tarefas = array_values($tarefas);
    }
    // Colocar conteúdo no arquivo JSON
    file_put_contents($arquivo, json_encode($tarefas));
    echo json_encode($tarefas);
}