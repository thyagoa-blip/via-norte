// Dados do trânsito
const trafficData = [
    { local: "Centro", status: "Intenso", detail: "Trânsito intenso", updated: "14:20" },
    { local: "Massaguaçu", status: "Atenção", detail: "Fluxo lento", updated: "14:10" },
    { local: "Martim de Sá", status: "Normal", detail: "Trânsito normal", updated: "14:05" },
    { local: "Indaiá", status: "Normal", detail: "Trânsito normal", updated: "13:50" },
    { local: "Perequê-Mirim", status: "Atenção", detail: "Atenção na via", updated: "13:45" }
];

// Dados das obras e ocorrências
const worksData = [
    {
        title: "Obra na Av. Atlântica",
        local: "Centro",
        type: "Obra",
        status: "Em andamento",
        date: "25/09/2026",
        description: "Manutenção da via."
    },
    {
        title: "Interdição na Rua da Praia",
        local: "Martim de Sá",
        type: "Interdição",
        status: "Interditada",
        date: "25/09/2026",
        description: "Evento na orla."
    },
    {
        title: "Acidente na Rod. SP-55",
        local: "Porto Novo",
        type: "Ocorrência",
        status: "Registrada",
        date: "25/09/2026",
        description: "Colisão envolvendo veículos."
    }
];

let filtroTransito = "Todos";
let tipoRegistros = "works";
let ocorrencias = [];

// Mostra uma mensagem na tela
function mostrarMensagem(mensagem) {
    const toast = document.getElementById("toast");

    toast.textContent = mensagem;
    toast.classList.remove("hidden");

    setTimeout(function () {
        toast.classList.add("hidden");
    }, 3000);
}

// Troca de página
function mostrarPagina(pagina) {
    const paginas = document.querySelectorAll(".page");

    for (let i = 0; i < paginas.length; i++) {
        if (paginas[i].id === pagina) {
            paginas[i].classList.remove("hidden");
        } else {
            paginas[i].classList.add("hidden");
        }
    }

    const botoes = document.querySelectorAll(".nav-item");

    for (let i = 0; i < botoes.length; i++) {
        if (botoes[i].dataset.page === pagina) {
            botoes[i].classList.add("text-via", "font-bold");
            botoes[i].classList.remove("text-[#7a8995]");
        } else {
            botoes[i].classList.remove("text-via", "font-bold");
            botoes[i].classList.add("text-[#7a8995]");
        }
    }

    if (pagina === "trafficPage") {
        mostrarTransito();
    }

    if (pagina === "worksPage") {
        mostrarObras();
    }

    window.scrollTo(0, 0);
}

// Retorna as classes do status
function classeStatus(status) {
    if (status === "Normal" || status === "Registrada") {
        return "bg-[#dff6e9] text-[#137548]";
    }

    if (status === "Atenção" || status === "Em andamento") {
        return "bg-[#fff2cc] text-[#8a6500]";
    }

    return "bg-[#ffe1e1] text-[#a52b2b]";
}

// Evita que textos digitados sejam interpretados como HTML
function protegerTexto(texto) {
    return String(texto).replace(/[&<>"']/g, function (caractere) {
        if (caractere === "&") return "&amp;";
        if (caractere === "<") return "&lt;";
        if (caractere === ">") return "&gt;";
        if (caractere === '"') return "&quot;";
        return "&#39;";
    });
}

// Mostra os locais com trânsito
function mostrarTransito() {
    const pesquisa = document.getElementById("trafficSearch").value.toLowerCase().trim();
    const lista = document.getElementById("trafficList");

    let html = "";

    for (let i = 0; i < trafficData.length; i++) {
        const item = trafficData[i];

        const mesmoFiltro =
            filtroTransito === "Todos" || item.status === filtroTransito;

        const encontrou =
            item.local.toLowerCase().includes(pesquisa);

        if (mesmoFiltro && encontrou) {
            html += `
                <article class="bg-white border border-border rounded-[9px] p-[15px] flex items-center justify-between gap-[15px] max-[480px]:items-start">
                    <div>
                        <h3 class="text-sm m-0 mb-[7px]">${protegerTexto(item.local)}</h3>
                        <span class="inline-block rounded-xl py-1 px-[9px] text-[11px] font-bold ${classeStatus(item.status)}">
                            ${protegerTexto(item.detail)}
                        </span>
                    </div>

                    <div class="text-right text-muted text-[11px] whitespace-nowrap max-[480px]:whitespace-normal max-[480px]:min-w-[85px]">
                        Última atualização<br>
                        <b>${item.updated}</b>
                    </div>
                </article>
            `;
        }
    }

    if (html === "") {
        html = `<p class="text-muted leading-[1.5] m-0 mb-5">Nenhum local encontrado.</p>`;
    }

    lista.innerHTML = html;
}

// Mostra as obras ou ocorrências
function mostrarObras() {
    const pesquisa = document.getElementById("worksSearch").value.toLowerCase().trim();
    const lista = document.getElementById("worksList");

    let html = "";

    // Mostra obras
    if (tipoRegistros === "works") {
        for (let i = 0; i < worksData.length; i++) {
            const item = worksData[i];

            if (item.type === "Ocorrência") {
                continue;
            }

            const texto = (
                item.title + " " +
                item.local + " " +
                item.description
            ).toLowerCase();

            if (texto.includes(pesquisa)) {
                html += criarRegistro(item);
            }
        }
    }

    // Mostra ocorrências
    else {
        for (let i = 0; i < worksData.length; i++) {
            const item = worksData[i];

            if (item.type === "Ocorrência") {
                const texto = (
                    item.title + " " +
                    item.local + " " +
                    item.description
                ).toLowerCase();

                if (texto.includes(pesquisa)) {
                    html += criarRegistro(item);
                }
            }
        }

        for (let i = 0; i < ocorrencias.length; i++) {
            const item = ocorrencias[i];

            const texto = (
                item.title + " " +
                item.local + " " +
                item.description
            ).toLowerCase();

            if (texto.includes(pesquisa)) {
                html += criarRegistro(item);
            }
        }
    }

    if (html === "") {
        html = `<p class="text-muted leading-[1.5] m-0 mb-5">Nenhum registro encontrado.</p>`;
    }

    lista.innerHTML = html;
}

// Cria o HTML de uma obra ou ocorrência
function criarRegistro(item) {
    return `
        <article class="bg-white border border-border rounded-[9px] p-[15px] flex items-center justify-between gap-[15px] max-[480px]:items-start">
            <div>
                <h3 class="text-sm m-0 mb-[7px]">${protegerTexto(item.title)}</h3>
                <p class="my-1 text-muted text-xs">
                    Local: ${protegerTexto(item.local)}
                </p>
                <p class="my-1 text-muted text-xs">
                    ${protegerTexto(item.description)}
                </p>
                <span class="inline-block rounded-xl py-1 px-[9px] text-[11px] font-bold ${classeStatus(item.status)}">
                    ${protegerTexto(item.status)}
                </span>
            </div>

            <div class="text-right text-muted text-[11px] whitespace-nowrap max-[480px]:whitespace-normal max-[480px]:min-w-[85px]">
                ${protegerTexto(item.date || "Hoje")}
            </div>
        </article>
    `;
}


// LOGIN
document.getElementById("loginForm").addEventListener("submit", function (evento) {
    evento.preventDefault();

    const email = document.getElementById("email");

    if (!email.checkValidity()) {
        mostrarMensagem("Digite um e-mail válido.");
        return;
    }

    document.getElementById("loginView").classList.add("hidden");
    document.getElementById("mainView").classList.remove("hidden");

    mostrarPagina("homePage");
    mostrarMensagem("Login de demonstração realizado!");
});

// Mostrar ou esconder senha
document.getElementById("togglePassword").addEventListener("click", function () {
    const senha = document.getElementById("password");

    if (senha.type === "password") {
        senha.type = "text";
    } else {
        senha.type = "password";
    }
});

// Esqueci minha senha
document.getElementById("forgotPassword").addEventListener("click", function () {
    mostrarMensagem("Recuperação de senha será implementada com o back-end.");
});

// Sair
document.getElementById("logoutBtn").addEventListener("click", function () {
    document.getElementById("mainView").classList.add("hidden");
    document.getElementById("loginView").classList.remove("hidden");

    document.getElementById("loginForm").reset();
});

// Botões de navegação
const botoesPagina = document.querySelectorAll("[data-page]");

for (let i = 0; i < botoesPagina.length; i++) {
    botoesPagina[i].addEventListener("click", function () {
        mostrarPagina(this.dataset.page);
    });
}


// FILTROS DO TRÂNSITO
document.getElementById("trafficFilters").addEventListener("click", function (evento) {
    const botao = evento.target.closest("[data-filter]");

    if (!botao) {
        return;
    }

    filtroTransito = botao.dataset.filter;

    const botoes = document.querySelectorAll("#trafficFilters .chip");

    for (let i = 0; i < botoes.length; i++) {
        if (botoes[i] === botao) {
            botoes[i].classList.add("bg-via", "text-white", "border-via", "active");
            botoes[i].classList.remove("bg-white", "text-[#465664]", "border-border");
        } else {
            botoes[i].classList.remove("bg-via", "text-white", "border-via", "active");
            botoes[i].classList.add("bg-white", "text-[#465664]", "border-border");
        }
    }

    mostrarTransito();
});

// Pesquisa de trânsito
document.getElementById("trafficSearch").addEventListener("input", function () {
    mostrarTransito();
});

// Pesquisa de obras
document.getElementById("worksSearch").addEventListener("input", function () {
    mostrarObras();
});


// BOTÕES DE OBRAS E OCORRÊNCIAS
const botoesTipo = document.querySelectorAll(".segmented button");

for (let i = 0; i < botoesTipo.length; i++) {
    botoesTipo[i].addEventListener("click", function () {
        tipoRegistros = this.dataset.kind;

        for (let j = 0; j < botoesTipo.length; j++) {
            if (botoesTipo[j] === this) {
                botoesTipo[j].classList.add("bg-via", "text-white");
                botoesTipo[j].classList.remove("bg-transparent", "text-[#536574]");
            } else {
                botoesTipo[j].classList.remove("bg-via", "text-white");
                botoesTipo[j].classList.add("bg-transparent", "text-[#536574]");
            }
        }

        mostrarObras();
    });
}


// CONTADOR DE CARACTERES
document.getElementById("incidentDescription").addEventListener("input", function () {
    document.getElementById("charCount").textContent = this.value.length;
});


// FORMULÁRIO DE OCORRÊNCIA
document.getElementById("incidentForm").addEventListener("submit", function (evento) {
    evento.preventDefault();

    const tipo = document.getElementById("incidentType").value;
    const local = document.getElementById("incidentLocation").value.trim();
    const data = document.getElementById("incidentDate").value;
    const descricao = document.getElementById("incidentDescription").value.trim();

    const partesData = data.split("-");

    const novaOcorrencia = {
        title: tipo + " - " + local,
        local: local,
        type: "Ocorrência",
        status: "Registrada",
        date: partesData[2] + "/" + partesData[1] + "/" + partesData[0],
        description: descricao
    };

    ocorrencias.unshift(novaOcorrencia);

    this.reset();

    document.getElementById("charCount").textContent = "0";

    mostrarMensagem("Ocorrência registrada nesta demonstração!");

    tipoRegistros = "incidents";
    mostrarPagina("worksPage");

    for (let i = 0; i < botoesTipo.length; i++) {
        if (botoesTipo[i].dataset.kind === "incidents") {
            botoesTipo[i].classList.add("bg-via", "text-white");
            botoesTipo[i].classList.remove("bg-transparent", "text-[#536574]");
        } else {
            botoesTipo[i].classList.remove("bg-via", "text-white");
            botoesTipo[i].classList.add("bg-transparent", "text-[#536574]");
        }
    }

    mostrarObras();
});


// Coloca a data de hoje no formulário
const hoje = new Date();
const ano = hoje.getFullYear();
const mes = String(hoje.getMonth() + 1).padStart(2, "0");
const dia = String(hoje.getDate()).padStart(2, "0");

document.getElementById("incidentDate").value = ano + "-" + mes + "-" + dia;

// Mostra o trânsito quando a página abre
mostrarTransito();
