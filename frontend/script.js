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
let gameActive = false;
let difficulty;
let cardGridEasy = document.getElementById("card-grid-easy")
let cardGridMedium = document.getElementById("card-grid-medium")
let cardGridHard = document.getElementById("card-grid-hard")

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
    let pokemonRetrieved = [];
    let i = 0;
    while (i < numberOfCards) {
        let randomPokemon = getRandomElement(allPokemon);
        if (!pokemonRetrieved.includes(randomPokemon.name)){ // prevent duplicates from being added
            console.log(`Pokemon added: ${randomPokemon.name}`)
            pokemonRetrieved.push(randomPokemon.name);
            let response = await axios.get(randomPokemon.url);
            cardFronts[i].src = response.data.sprites.other["official-artwork"].front_default
            cardFronts[i + 1].src = response.data.sprites.other["official-artwork"].front_default
        } else {
            continue
        }
        i += 2;
    }
    return;
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
                        resetGame(timer, difficulty);
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
                    // Chance to activate powerup on incorrect match
                    activatePowerUp();
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
    gameActive = true;
    document.getElementById("easy").disabled = true;
    document.getElementById("medium").disabled = true;
    document.getElementById("hard").disabled = true;

    let cards = document.querySelectorAll(".card");
    cards.forEach((card) => {
        card.style.pointerEvents = "auto";
    })
    timer = setInterval(() => {
        milliseconds += 1000;
        console.log(milliseconds)
        checkTimesUp(milliseconds);
        handleTime(milliseconds);
    }, 1000)
})

// check if the time is up depending on difficulty
function checkTimesUp(timeMilliseconds) {
    if ((timeMilliseconds == 20000) && (difficulty == "easy")) {
        resetGame(timer, difficulty);
        alert("Times up! Better luck next time!");
    }
    else if ((timeMilliseconds == 60000) && (difficulty == "medium")) {
        resetGame(timer, difficulty);
        alert("Times up! Better luck next time!");
    }
    else if ((timeMilliseconds == 120000) && (difficulty == "hard")) {
        resetGame(timer, difficulty);
        alert("Times up! Better luck next time!");
    }
}

let lightButton = document.getElementById("light");
lightButton.addEventListener("click", () => {
    cardGridEasy.style.backgroundColor = "white";
    cardGridMedium.style.backgroundColor = "white";
    cardGridHard.style.backgroundColor = "white";
    //save theme to local storage
    localStorage.setItem("theme", "light");
})

let darkButton = document.getElementById("dark");
darkButton.addEventListener("click", () => {
    cardGridEasy.style.backgroundColor = "black";
    cardGridMedium.style.backgroundColor = "black";
    cardGridHard.style.backgroundColor = "black";
    //save theme to local storage
    localStorage.setItem("theme", "dark");
})

async function activeSavedTheme() {
    let theme = localStorage.getItem("theme");
    if (theme === "dark") {
        cardGridEasy.style.backgroundColor = "black";
        cardGridMedium.style.backgroundColor = "black";
        cardGridHard.style.backgroundColor = "black";
    } else {
        cardGridEasy.style.backgroundColor = "white";
        cardGridMedium.style.backgroundColor = "white";
        cardGridHard.style.backgroundColor = "white";
    }
}
activeSavedTheme();

function playWinningAnimation() {
    let winAnimationElement = document.getElementById("win");
    let winMessageContainer = document.getElementById("winMessageContainer");
    winAnimationElement.style.display = "block"
    winAnimationElement.classList.add("winAnimation");
    winAnimationElement.addEventListener("animationend", () => {
        winAnimationElement.style.display = "none";
        winAnimationElement.classList.remove("winAnimation");
        winMessageContainer.style.display = "block";
        winMessageContainer.classList.add("winMessageAnimation");
        winMessageContainer.addEventListener("animationend", () => {
            setTimeout(() => {
                winMessageContainer.style.display = "none";
            }, 3000)
        })
    });
}

function handleTime(milliseconds) {
    let timeDiv = document.getElementById("time");
    seconds = milliseconds / 1000;
    if (seconds == 60) {
        seconds = 0;
        minutes++;
    }
    if (minutes == 60) {
        minutes = 0;
        hours++;
    }
    timeDiv.innerText = `${hours}:${minutes}:${seconds}`
}

let timeMessageDiv = document.getElementById("timeMessage");
function displayTimeAllowed(difficulty) {
    if (difficulty == "easy") {
        timeMessageDiv.innerText = "You have 20 seconds!"
    } else if (difficulty == "medium") {
        timeMessageDiv.innerText = "You have 1 minute!"
    } else if (difficulty == "hard") {
        timeMessageDiv.innerText = "You have 2 minutes!"
    }
}

let restartButton = document.getElementById("restartButton");
restartButton.addEventListener("click", () => {
    resetGame(timer, difficulty)
})

async function resetGame(timer, difficulty) {
    // reset the game timer
    clearInterval(timer);
    timeDiv.innerText = `00:00:00`
    milliseconds = 0; //reset the time to 0 milliseconds
    timer = null; // reset timer activation check

    // reset all game boards by removing them
    cardGridEasy.style.display = "none";
    cardGridHard.style.display = "none";
    cardGridMedium.style.display = "none"

    // Reactivate the difficulty buttons
    document.getElementById("easy").disabled = false;
    document.getElementById("medium").disabled = false;
    document.getElementById("hard").disabled = false;

    let grid = document.getElementById(`card-grid-${difficulty}`)

    let cards = grid.querySelectorAll(".card");
    cards.forEach((card) => {
        card.style.pointerEvents = "none";
        card.classList.toggle("flip");
    })
}

// reveal all cards for a short time
async function activatePowerUp() {
    if (Math.random() < 0.3) {
        alert("Power Up!! Catch 'em all!!");
        let cards = document.querySelectorAll(".card");
        cards.forEach((card) => {
            card.classList.toggle("flip");
            setTimeout(() => {
                card.classList.toggle("flip");
            }, 1500)
        })
    }
}

async function handleGameDifficulty() {
    let easyDifficultyBtn = document.getElementById("easy");
    let mediumDifficultyBtn = document.getElementById("medium");
    let hardDifficultyBtn = document.getElementById("hard");
    // medium
    mediumDifficultyBtn.addEventListener("click", async () => {
        difficulty = "medium";
        totalPairs = 6;
        numberOfCards = totalPairs * 2;
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
        displayTimeAllowed("medium");
        await addImagesToCardFronts(document.getElementById("card-grid-medium"));
    })
    hardDifficultyBtn.addEventListener("click", async () => {
        difficulty = "hard";
        totalPairs = 12;
        numberOfCards = totalPairs * 2;
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
        displayTimeAllowed("hard");
        await addImagesToCardFronts(document.getElementById("card-grid-hard"));
    })
    easyDifficultyBtn.addEventListener("click", async () => {
        difficulty = "easy";
        totalPairs = 3;
        numberOfCards = totalPairs * 2;
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
        displayTimeAllowed("easy");
        await addImagesToCardFronts(document.getElementById("card-grid-easy"));
    })
}
handleGameDifficulty();

async function init() {
    await fetchPokemon();
    await addImagesToCardFronts(document.getElementById("card-grid-easy"));
}

init();



