error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: application/json');

$file = 'tarefas.json';

if (!file_exists($file)) {
    file_put_contents($file, json_encode([]));
}

$tarefas = json_decode(file_get_contents($file), true);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Adicionar ou editar uma tarefa
    $titulo = $_POST['titulo'] ?? '';
    $descricao = $_POST['descricao'] ?? '';
    $id = $_POST['id'] ?? null;

    if ($id !== null) {
        // Editar tarefa existente
        $tarefas[$id]['titulo'] = $titulo;
        $tarefas[$id]['descricao'] = $descricao;
    } else {
        // Adicionar nova tarefa
        $novaTarefa = ['titulo' => $titulo, 'descricao' => $descricao, 'concluida' => false];
        $tarefas[] = $novaTarefa;
    }
    file_put_contents($file, json_encode($tarefas));
    echo json_encode($tarefas);
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Pesquisar ou listar tarefas
    if (isset($_GET['pesquisa'])) {
        $pesquisa = $_GET['pesquisa'];
        $resultados = array_filter($tarefas, function($tarefa) use ($pesquisa) {
            return strpos(strtolower($tarefa['titulo']), strtolower($pesquisa)) !== false;
        });
        echo json_encode(array_values($resultados));
    } else {
        echo json_encode($tarefas);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Deletar tarefa
    $id = $_GET['id'] ?? null;
    if ($id !== null) {
        array_splice($tarefas, $id, 1);
        file_put_contents($file, json_encode($tarefas));
    }
    echo json_encode($tarefas);
} elseif ($_SERVER['REQUEST_METHOD'] === 'PATCH') {
    // Marcar tarefa como concluída
    parse_str(file_get_contents("php://input"), $data);
    $id = $data['id'] ?? null;
    if ($id !== null) {
        $tarefas[$id]['concluida'] = !$tarefas[$id]['concluida'];
        file_put_contents($file, json_encode($tarefas));
    }
    echo json_encode($tarefas);
}