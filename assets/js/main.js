function getPlaneta(pessoas) {
    return Promise.all(pessoas.map(personagem => fetch(personagem.homeworld).then(p => p.json()).then(p => { personagem.homeworld = p; return personagem })));
}

function getVeiculo(pessoas) {
    return Promise.all(pessoas.map(personagem => Promise.all(personagem.vehicles.map(v => fetch(v).then(r => r.json()))))).then((p) => { pessoas.map((pe, i) => { pe.vehicles = p[i] }); return pessoas });
};

let pessoas = [];
var pagina;
let j = 0;
let urlBase = "https://swapi.dev/api/people/";
function add() {
    fetch(urlBase).then(respota => respota.json())
        .then(res => { pagina = res.next; return getPlaneta(res.results) })
        .then(res => getVeiculo(res))
        .then(pessoas => {

            let html = "";
            pessoas.map((p) => {

                html +=
                    `<div class="card">
            <div class="img">
                <img class="imgG" src="https://starwars-visualguide.com/assets/img/characters/${p.url.replace(/\D+/, '').replace("/", "")}.jpg" alt="">
                <p>${p.name}</p>

            </div>
            <div class="botao id${j + 1}">
                <button class="btn1" style="filter: brightness(1);"
                    onclick="abrirTexto('info', '${j + 1}', 'btn1')">INFO</button>
                <button class="btn2" style="filter: brightness(0.5);"
                    onclick="abrirTexto('fotos', '${j + 1}', 'btn2')">ORIGEM</button>
                <button class="btn3" style="filter: brightness(0.5);"
                    onclick="abrirTexto('filmes', '${j + 1}', 'btn3')">NAVES</button>
            </div>
            <div id="texto" class="texto${j + 1}">
                <p id="info" class="texto">Ano de Nascimento: ${p.birth_year == 'unknown' ? 'Desconhecido' : p.birth_year} <br><br>
                    Altura: 172cm <br><br>
                    Peso: ${p.mass == "unknown" ? "Desconhecido" : p.mass + "kg"} <br><br>
                    Gênero: ${p.gender == "male" ? "Masculino" : "Feminino"} <br><br>
                <p id="fotos" class="texto" style="display:none">
                    Planelta: ${p.homeworld.name} <br><br>
                    Clima: ${p.homeworld.climate == 'unknown' ? 'Desconhecido' : p.homeworld.climate} <br><br>
                    População: ${p.homeworld.population} <br><br>
                    Terreno: ${p.homeworld.terrain} <br><br>
                </p>
                <p id="filmes" class="texto" style="display:none">
                    ${(p.vehicles.length) ? (p.vehicles.map(p =>

                        `Nome: ${p.name}<br><br>Modelo: ${p.model}<br><br>`)

                    ).toString().replace(",", "") : "Nenhuma cadastrada!"}
                    
            </div>
        </div>`;
                j += 1;
            });

            document.getElementsByClassName('cards')[0].innerHTML += html;
            document.getElementsByClassName("w3-button")[0].style.display = "block";
            if (pagina === null) {
                document.getElementsByClassName("w3-button")[0].style.display = "none";
            }
        }
        );

};
add();


function abrirTexto(texto, id, btnName) {
    let btn = document.getElementsByClassName('id' + id)[0];

    btn = btn.getElementsByTagName('button')
    for (i = 0; i < btn.length; i++) {
        if (btn[i].attributes.class.value.toString() != btnName) {
            btn[i].style.filter = 'brightness(0.5)';
        }
        else {
            btn[i].style.filter = 'brightness(1)';
        }

    }
    let tag = document.getElementsByClassName('texto' + id)[0].getElementsByTagName('p');
    for (i = 0; i < tag.length; i++) {
        tag[i].style.display = "none";
    }

    for (i = 0; i < tag.length; i++) {
        if (tag[i].attributes.id.value.toString() == texto) {
            tag[i].style.display = "block";
            break;
        }
    }
}

function adicionar() {
    if (pagina != urlBase) {
        urlBase = pagina;
        add();
    }

}
