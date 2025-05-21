let allPokemon = [];
let flippedPokemon;
let numberOfCards = Array.from(document.querySelectorAll(".card")).length;
let totalPairs = numberOfCards / 2;
let pairsMatched = 0;
let pairsRemaining = totalPairs - pairsMatched;
let numberOfClicks = 0;
// Timer variables
let milliseconds = 0;
let seconds = 0;
let minutes = 0
let hours = 0;
let timeDiv = document.getElementById("time");

// Populate pairs remaining on start
document.getElementById("pairsRemaining").innerText = `Pairs Remaining: ${pairsRemaining}`;

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

const onCardClick = async function (e) {
    if (locked) {
        return;
    }

    if (!firstCardImg) {
        firstCardImg = this.querySelector(".cardFront");
        firstCardImg.classList.add("first");
        console.log(firstCardImg)
        this.classList.toggle("flip")
        numberOfClicks++;
        document.getElementById("numberOfClicks").innerText = `Number of Clicks: ${numberOfClicks}`
    } else {
        if (!this.querySelector(".cardFront").classList.contains("first")) {
            secondCardImg = this.querySelector(".cardFront");
            this.classList.toggle("flip")
            numberOfClicks++;
            document.getElementById("numberOfClicks").innerText = `Number of Clicks: ${numberOfClicks}`
        }
    }
    if (firstCardImg && secondCardImg) {
        locked = true;
        console.log("locked");
        await new Promise((resolve, reject) => {
            if (firstCardImg.src == secondCardImg.src) {
                setTimeout((arg) => {
                    console.log("match");
                    pairsMatched++;
                    document.getElementById("pairsMatched").innerText = `Pairs Matched: ${pairsMatched}`
                    // Add number of remaining pairs to the header
                    pairsRemaining = totalPairs - pairsMatched;
                    // Update pairs remaining
                    document.getElementById("pairsRemaining").innerText = `Pairs Remaining: ${pairsRemaining}`;
                    firstCardImg.parentNode.removeEventListener("click", onCardClick);
                    secondCardImg.parentNode.removeEventListener("click", onCardClick);
                    resolve();
                }, 500)
            } else {
                console.log("no match");
                // flip the cards back
                setTimeout((arg) => {
                    firstCardImg.parentNode.classList.toggle("flip");
                    secondCardImg.parentNode.classList.toggle("flip");
                    firstCardImg.classList.remove("first");
                    resolve();
                }, 1000)
            }
        })
        firstCardImg = undefined;
        secondCardImg = undefined;
        locked = false;
        console.log("unlocked")
    }
}
cards.forEach((arg) => {
    arg.addEventListener("click", onCardClick)
})

// Add total number of pairs to the header
document.getElementById("pairsTotal").innerText = `Total Pairs: ${totalPairs}`;

document.getElementById("startButton").addEventListener("click", (e) => {
    setInterval((arg) => {
        milliseconds += 1000 / 100;

        handleTime(milliseconds);
    }, 1000)
})

function handleTime(milliseconds) {
    let timeDiv = document.getElementById("time");
    if (milliseconds == 10) {
        milliseconds = 0;
        seconds++;
    }
    if (seconds == 60) {
        seconds = 0;
        minutes++;
    }
    if (minutes == 60) {
        minutes = 0;
        hours++;
    }
    timeDiv.innerText = `${hours}${minutes}:${seconds}${milliseconds}`
}

async function init() {
    await fetchPokemon();
    await addImagesToCardFronts();
}

init();



