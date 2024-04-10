let pokemonData = [];
let colors = {
    "normal": "#B0B090",
    "fighting": "#C84038",
    "flying": "#B0B0F8",
    "poison": "#8D62A0",
    "ground": "#E8D090",
    "rock": "#C0B058",
    "bug": "#A0C030",
    "ghost": "#7A6AA8",
    "steel": "#C0C0E0",
    "fire": "#FF7C7C",
    "water": "#8CC7FF",
    "grass": "#5CE0C8",
    "electric": "#FFE38C",
    "psychic": "#FF8CA8",
    "ice": "#B0F0F0",
    "dragon": "#8070F8",
    "dark": "#7A7A68"
};

let currentPokemonIndex = 0;

async function init() {
    await loadAllPokemons();
}

async function loadAllPokemons() {
    let url = 'https://pokeapi.co/api/v2/pokemon?limit=20';
    let response = await fetch(url);
    let data = await response.json();

    for (let index = 0; index < data.results.length; index++) {
        let pokemonUrl = data.results[index].url;
        let pokemonResponse = await fetch(pokemonUrl);
        let pokemonDataItem = await pokemonResponse.json();
        pokemonData.push(pokemonDataItem);
        loadPokemonBox(pokemonDataItem);
    }
}

function renderPokemonInfo(pokemon) {
    document.getElementById('popupName').textContent = pokemon.name;
    document.getElementById('popupImage').src = pokemon.sprites.other.home.front_shiny;
    document.getElementById('popupHeight').textContent = (pokemon.height / 10) + " m";
    document.getElementById('popupWeight').textContent = (pokemon.weight / 10) + " kg";
}

function loadPokemonBox(pokemonData) {
    let pokemonCartContainer = document.getElementById('pokemonCartContainer');
    let pokemonCartHTML = createPokemonCardHTML(pokemonData);

    pokemonCartContainer.insertAdjacentHTML('beforeend', pokemonCartHTML);

    let pokemonType = pokemonData['types'][0]['type']['name'];
    let backgroundColor = colors[pokemonType];
    let pokemonCart = pokemonCartContainer.lastElementChild;
    pokemonCart.style.backgroundColor = backgroundColor;

    pokemonCart.addEventListener('click', function() {
        openPopup(pokemonData);
    });
}

function createPokemonCardHTML(pokemonData) {
    return `
        <div class="pokemonCart" id="${pokemonData['name']}">
            <p class="pokemonCartName">${pokemonData['name']}</p>
            <div class="flex-end">
                <p class="pokemonCartType">${pokemonData['types'][0]['type']['name']}</p>
            </div>
            <img class="pokemonCartImage" src="${pokemonData['sprites']['other']['home']['front_shiny']}">
        </div>
    `;
}

function openPopup(pokemon) {
    let popupHeader = document.getElementById('popupHeader');
    let pokemonType = pokemon.types[0].type.name;
    popupHeader.style.backgroundColor = colors[pokemonType];

    renderPokemonInfo(pokemon);
    document.getElementById('pokemonPopup').style.display = 'block';
    document.getElementById('overlay').style.display = 'block'; 
    renderPopupStatsChart(pokemon.stats);
}

function closePopup() {
    document.getElementById('popupName').textContent = '';
    document.getElementById('popupImage').src = '';
    document.getElementById('popupHeight').textContent = '';
    document.getElementById('popupWeight').textContent = '';
    document.getElementById('pokemonPopup').style.display = 'none';
    document.getElementById('overlay').style.display = 'none'; 

    document.querySelector('.close').addEventListener('click', closePopup);
    document.getElementById('pokemonCartContainer').addEventListener('click', handlePokemonCartClick);
}



async function loadMorePokemons() {
    let nextPageUrl = 'https://pokeapi.co/api/v2/pokemon?offset=' + pokemonData.length + '&limit=20';
    let response = await fetch(nextPageUrl);
    let data = await response.json();

    for (let index = 0; index < data.results.length; index++) {
        let pokemonUrl = data.results[index].url;
        let pokemonResponse = await fetch(pokemonUrl);
        let pokemonDataItem = await pokemonResponse.json();
        pokemonData.push(pokemonDataItem);
        loadPokemonBox(pokemonDataItem);
    }
}

async function filterNames() {
    let search = document.getElementById('search').value.toLowerCase();

    document.getElementById('pokemonCartContainer').innerHTML = '';

    for (let pokemon of pokemonData) {
        if (pokemon.name.toLowerCase().includes(search)) { 
            loadPokemonBox(pokemon);
        }
    }
}

function handlePokemonCartClick(event) {
    if (event.target.classList.contains('pokemonCart')) {
        let pokemonName = event.target.id;
        let pokemon = pokemonData.find(p => p.name === pokemonName);
        if (pokemon) {
            openPopup(pokemon);
        }
    }
}

function nextPopup(direction) {
    currentPokemonIndex += direction;

    if (currentPokemonIndex < 0) {
        currentPokemonIndex = 0;
    } else if (currentPokemonIndex >= pokemonData.length) {
        currentPokemonIndex = pokemonData.length - 1;
    }

    openPopup(pokemonData[currentPokemonIndex]);

    if (currentPokemonIndex === 0) {
        document.querySelector('.popup-arrow.left').style.display = 'none';
    } else {
        document.querySelector('.popup-arrow.left').style.display = 'block';
    }

    if (currentPokemonIndex === pokemonData.length - 1) {
        document.querySelector('.popup-arrow.right').style.display = 'none';
    } else {
        document.querySelector('.popup-arrow.right').style.display = 'block';
    }
}
