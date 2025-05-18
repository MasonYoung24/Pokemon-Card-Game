const allPokemon = [];
async function fetchPokemon() {
    try {
        allPokemon = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=10000");
        console.log(allPokemon);
    } catch (err) {
        console.error("Error fetching Pokemon:", err.message)
    }
}

function getRandomElement(arr) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}

fetchPokemon();


