const express = require("express");
const axios = require("axios");
const app = express();
const PORT = 3000;

// Check the server connection
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.get("/game", (req, res) => {
    res.render("index.html")
})

