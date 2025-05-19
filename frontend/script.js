let allPokemon = [];
async function fetchPokemon() {
    try {
        const response = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=10000");
        allPokemon = response.data.results;
    } catch (err) {
        console.error("Error fetching Pokemon:", err.message)
    }
}

function getRandomElement(arr) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}

async function addImagesToCardBacks() {
    let randomPokemon = getRandomElement(allPokemon);
    console.log(randomPokemon);
    let response = await axios.get(randomPokemon.url);
    console.log(response)

    let cardBacks = document.querySelectorAll(".cardBack");
    cardBacks.forEach(card => {
        card.src = response.data.sprites.other["official-artwork"].front_default
    });
}

// hide the card faces on flip
async function hideCardFace() {
    let cards = document.querySelectorAll(".card");
    let flipCounter = 0;
    cards.forEach(card => {
        card.addEventListener("animationend", () => {
            if (flipCounter < 2) {
                card.style.visibility = "hidden";
                flipCounter++;
            } 
        })
    });
};

async function init() {
    await fetchPokemon();
    await addImagesToCardBacks();
    await hideCardFace()
}

init();



