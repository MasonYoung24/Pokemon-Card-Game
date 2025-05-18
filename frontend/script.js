const allPokemon = [];
async function fetchPokemon() {
    try {
        const allPokemon = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=10000");
        console.log(allPokemon);
    } catch (err) {
        console.error("Error fetching Pokemon:", err.message)
    }
}

fetchPokemon();


