let allPokemon = [];
let flippedPokemon;
let numberOfCards = 6;
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
let pauseButton = document.getElementById("pauseButton");
let pause = pauseButton.classList.contains("on");

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

async function addImagesToCardFronts(container) {
    let cardFronts = Array.from(container.querySelectorAll(".cardFront"));
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
                    if (pairsRemaining == 0) {
                        playWinningAnimation();
                    }
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

// Start or resume timer on click of start button
let timer = null;
document.getElementById("startButton").addEventListener("click", (e) => {
    if (timer !== null) return; // prevent simultaneous events
    pauseButton.classList.remove("on")
    timer = setInterval(() => {
        const isPaused = pauseButton.classList.contains("on");
        console.log(isPaused)
        if (!isPaused) {
            milliseconds += 1000 / 100;
            handleTime(milliseconds);
        }
    }, 1000)
})

function playWinningAnimation() {
    let winAnimationElement = document.getElementById("win")
    winAnimationElement.style.display = "block"
    winAnimationElement.classList.add("winAnimation");
    winAnimationElement.addEventListener("animationend", ()=> {
        winAnimationElement.style.display = "none";
        winAnimationElement.classList.remove("winAnimation")
    });
}

function handleTime(milliseconds) {
    let timeDiv = document.getElementById("time");
    if (milliseconds == 1000) {
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

async function pauseTimer() {
    pauseButton.addEventListener("click", () => {
        pauseButton.classList.add("on");
    })
}
pauseTimer();

async function restartTimer() {
    let restartButton = document.getElementById("restartButton");
    restartButton.addEventListener("click", () => {
        clearInterval(timer);
        timeDiv.innerText = `00:00:00`
        milliseconds = 0; //reset the time to 0 milliseconds
        timer = null; // reset timer activation check
    })
}
restartTimer(timer);

async function handleGameDifficulty() {
    let easyDifficultyBtn = document.getElementById("easy");
    let mediumDifficultyBtn = document.getElementById("medium");
    let hardDifficultyBtn = document.getElementById("hard");
    let cardGridEasy = document.getElementById("card-grid-easy")
    let cardGridMedium = document.getElementById("card-grid-medium")
    let cardGridHard = document.getElementById("card-grid-hard")
    // medium
    mediumDifficultyBtn.addEventListener("click", async () => {
        totalPairs = 6;
        pairsMatched = 0;
        pairsRemaining = totalPairs - pairsMatched
        // Populate pairs remaining on start
        document.getElementById("pairsRemaining").innerText = `Pairs Remaining: ${pairsRemaining}`;
        document.getElementById("pairsTotal").innerText = `Total Pairs: ${totalPairs}`;
        let cards = document.querySelectorAll(".card");
        cards.forEach((card) => {
            card.style.flexBasis = "25%";
        })
        cardGridEasy.style.display = "none";
        cardGridHard.style.display = "none";
        cardGridMedium.style.display = "flex"
        await addImagesToCardFronts(document.getElementById("card-grid-medium"));
    })
    hardDifficultyBtn.addEventListener("click", async () => {
        totalPairs = 12;
        pairsMatched = 0;
        pairsRemaining = totalPairs - pairsMatched
        // Populate pairs remaining on start
        document.getElementById("pairsRemaining").innerText = `Pairs Remaining: ${pairsRemaining}`;
        document.getElementById("pairsTotal").innerText = `Total Pairs: ${totalPairs}`;
        let cards = document.querySelectorAll(".card");
        cards.forEach((card) => {
            card.style.flexBasis = "16.66%";
        })
        cardGridEasy.style.display = "none";
        cardGridMedium.style.display = "none";
        cardGridHard.style.display = "flex";
        await addImagesToCardFronts(document.getElementById("card-grid-hard"));
    })
    easyDifficultyBtn.addEventListener("click", async () => {
        totalPairs = 3;
        pairsMatched = 0;
        pairsRemaining = totalPairs - pairsMatched
        // Populate pairs remaining on start
        document.getElementById("pairsRemaining").innerText = `Pairs Remaining: ${pairsRemaining}`;
        document.getElementById("pairsTotal").innerText = `Total Pairs: ${totalPairs}`;
        let cards = document.querySelectorAll(".card");
        cards.forEach((card) => {
            card.style.flexBasis = "33%";
        })
        cardGridHard.style.display = "none";
        cardGridMedium.style.display = "none";
        cardGridEasy.style.display = "flex";
        await addImagesToCardFronts(document.getElementById("card-grid-easy"));
    })
}
handleGameDifficulty();

async function init() {
    await fetchPokemon();
    await addImagesToCardFronts(document.getElementById("card-grid-easy"));
}

init();



