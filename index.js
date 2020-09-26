const { Router } = require("express");
let express = require("express");
let app = express();
let { INSERT, UPDATE } = require("./helpers/global");
const PORT = 8080;

app.get("/", (req, res) => {});

app.listen(PORT, () => {
    console.log(`App is listing PORT ${PORT}`);
});
