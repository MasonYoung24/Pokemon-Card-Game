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

let firstCardImg = undefined;
let secondCardImg = undefined;

let locked = false;

// Flip the card on click
const cards = document.querySelectorAll(".card")

const onCardClick = function (e) {
    if (locked) {
        return;
    }

    if (!firstCardImg) {
        firstCardImg = this.querySelector(".cardFront");
        firstCardImg.classList.add("first");
        console.log(firstCardImg)
        this.classList.toggle("flip")
    } else {
        if (!this.querySelector(".cardFront").classList.contains("first")) {
            secondCardImg = this.querySelector(".cardFront");
            this.classList.toggle("flip")
        }
    }
    if (firstCardImg && secondCardImg) {
        locked = true;
        console.log("locked");
        if (firstCardImg.src == secondCardImg.src) {
            setTimeout((arg) => {
                console.log("match");
                firstCardImg.parentNode.removeEventListener("click", onCardClick);
                secondCardImg.parentNode.removeEventListener("click", onCardClick);
                // reset images
                firstCardImg = undefined;
                secondCardImg = undefined;
                locked = false;
                console.log("unlocked")
            }, 500)
        } else {
            console.log("no match");
            // flip the cards back
            setTimeout((arg) => {
                firstCardImg.parentNode.classList.toggle("flip");
                secondCardImg.parentNode.classList.toggle("flip");
                firstCardImg.classList.remove("first");
                // reset images
                firstCardImg = undefined;
                secondCardImg = undefined;
                locked = false;
                console.log("unlocked")
            }, 1000)
        }
    }
}

cards.forEach((arg) => {
    arg.addEventListener("click", onCardClick)
})

async function init() {
    await fetchPokemon();
    await addImagesToCardFronts();
}

init();



