const overlay = document.getElementById("overlay");
const criarTarefa = document.getElementById("criarTarefa");
const lista = document.getElementById("lista"); 
const busca = document.getElementById("busca");
const inputTitulo = document.getElementById("titulo");
const inputDescricao = document.getElementById("descricao");
const formTarefa = document.querySelector("#criarTarefa form");
const modalTitulo = document.getElementById("modal-titulo");
const btnSalvar = document.getElementById("btn-salvar");


function abrirModal() {
    overlay.classList.add("active");
    criarTarefa.classList.add("active");
}

function fecharModal() {
    overlay.classList.remove("active");
    criarTarefa.classList.remove("active");
    formTarefa.reset();
    modalTitulo.innerText = "Criar tarefa";
    btnSalvar.innerText = "Criar";
    delete formTarefa.dataset.id; 
}

function buscarTarefas() {
    fetch("http://localhost:3000/tarefas")
        .then(res => res.json())
        .then(res => {
            inserirTarefas(res);
        });
}

function inserirTarefas(listaDeTarefas) {
    lista.innerHTML = ""; 
    if (listaDeTarefas.length > 0) {
        listaDeTarefas.map(tarefa => {
            lista.innerHTML += `
            <li>
                <h5>${tarefa.titulo}</h5>
                <p>${tarefa.descricao}</p>
                <div class="icons">
                    <div class="lapis">
                        <box-icon name='edit-alt' onclick="prepararEdicao(${tarefa.id})"></box-icon>
                    </div>
                    <div class="lixeira">
                        <box-icon name='trash' size="sm" onclick="deletarTarefa(${tarefa.id})"></box-icon>
                    </div>
                </div>
            </li>
            `;
        });
    } else {
        lista.innerHTML = "<h6>Nenhuma tarefa encontrada</h6>";
    }
}


function gerenciarEnvio(event) {
    event.preventDefault();
    
    const idEdicao = formTarefa.dataset.id;
    const tarefa = {
        titulo: inputTitulo.value,
        descricao: inputDescricao.value
    };

    const url = idEdicao ? `http://localhost:3000/tarefas/${idEdicao}` : "http://localhost:3000/tarefas";
    const metodo = idEdicao ? "PATCH" : "POST";

    fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tarefa)
    })
    .then(res => res.json())
    .then(() => {
        fecharModal();
        buscarTarefas();
    });
}


formTarefa.onsubmit = gerenciarEnvio;

function prepararEdicao(id) {
    fetch(`http://localhost:3000/tarefas/${id}`)
        .then(res => res.json())
        .then(tarefa => {
            inputTitulo.value = tarefa.titulo;
            inputDescricao.value = tarefa.descricao;
            formTarefa.dataset.id = tarefa.id; 

            modalTitulo.innerText = "Editar Tarefa";
            btnSalvar.innerText = "Salvar Alterações";
            
            abrirModal();
        });
}

function deletarTarefa(id) {
    if(confirm("Deseja realmente excluir esta tarefa?")) {
        fetch(`http://localhost:3000/tarefas/${id}`, { method: "DELETE" })
        .then(() => buscarTarefas());
    }
}

function pesquisarTarefas() {
    const termo = busca.value.toLowerCase();
    const lis = document.querySelectorAll("#lista li");
    
    lis.forEach(li => {
        const tituloTarefa = li.querySelector("h5").innerText.toLowerCase();
        if (tituloTarefa.includes(termo)) {
            li.classList.remove('oculto');
        } else {
            li.classList.add('oculto');
        }
    });
}

function salvarTarefa(event) {
    event.preventDefault(); 

    const dados = { titulo, descricao };

    const metodo = id ? "PATCH" : "POST";
    const url = id ? `http://localhost:3000/tarefas/${id}` : `http://localhost:3000/tarefas`;

    fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados)
    })
    .then(() => {
        fecharModal();
        location.reload(); 
    });
}

buscarTarefas();