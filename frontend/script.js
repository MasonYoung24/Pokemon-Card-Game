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
    let cardBacks = Array.from(document.querySelectorAll(".cardBack"));
    // shuffle the cardBacks
    cardBacks.sort(() => Math.random() - 0.5);
    let numberOfCards = cardBacks.length;
    for (let i = 0; i < numberOfCards; i += 2) {
        let randomPokemon = getRandomElement(allPokemon);
        let response = await axios.get(randomPokemon.url);
        cardBacks[i].src = response.data.sprites.other["official-artwork"].front_default
        cardBacks[i + 1].src = response.data.sprites.other["official-artwork"].front_default
    }
}

// hide the card faces on flip
async function hideCardFace() {
    let cards = document.querySelectorAll(".card");
    cards.forEach(card => {
        card.addEventListener("animationend", function () {
            const cardFront = this.querySelector(".cardFront");
            const cardBack = this.querySelector(".cardBack");
            if (cardFront.style.display != "none") {
                cardFront.style.display = "none"
                cardBack.style.display = "block"
            } else {
                cardFront.style.display = "block";
                cardBack.style.display = "none";
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



