let allPokemon = [];
let flippedPokemon;

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

async function addImagesToCardFronts() {
    let cardFronts = Array.from(document.querySelectorAll(".cardFront"));
    // shuffle the cardBacks
    cardFronts.sort(() => Math.random() - 0.5);
    let numberOfCards = cardFronts.length;
    for (let i = 0; i < numberOfCards; i += 2) {
        let randomPokemon = getRandomElement(allPokemon);
        let response = await axios.get(randomPokemon.url);
        cardFronts[i].src = response.data.sprites.other["official-artwork"].front_default
        cardFronts[i + 1].src = response.data.sprites.other["official-artwork"].front_default
    }
}

const cards = document.querySelectorAll(".card")
cards.forEach((arg) => {
    arg.addEventListener("click", function (e) {
        this.classList.toggle("flip")
    })
})

// async function compareFlippedPokemon() {
//     let cards = document.querySelectorAll(".card");
//     let flipCount = 1;
//     cards.forEach(card => {
//         card.addEventListener("click", function () {
//             // Keep track of which cards were flipped and trigger animation
//             this.classList.add("flipped");
//             let cardBack = this.getElementsByClassName("cardBack")[0];
//             if (cardBack.style.display != "block") {
//                 if (flippedPokemon === undefined) {
//                     flippedPokemon = cardBack.src
//                 } else if (flippedPokemon === cardBack.src) {
//                     console.log("the cards match!");
//                     flippedPokemon = undefined;
//                 } else {
//                     console.log("the cards do not match. Try again!")
//                     flippedPokemon = undefined;
//                     // flip the cards back
//                     setTimeout(() => {
//                         let flippedCards = document.getElementsByClassName("flipped")
//                         Array.from(flippedCards).forEach(card => {
//                             card.classList.remove("flipped");
//                         })
//                     }, 2000)
//                 }
//             } else {

//             }
//         })
//     })
// }


async function init() {
    await fetchPokemon();
    await addImagesToCardFronts();
    // await compareFlippedPokemon();
}

init();



