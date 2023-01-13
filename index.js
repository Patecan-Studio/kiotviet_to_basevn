const express = require("express")
const bodyParser = require("body-parser")
// Initialize express and define a port
const app = express()
const webhook = require("./api/webhook");
const product = require("./api/product");
const PORT = 3000
// Tell express to use body-parser's JSON parsing
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/webhook",webhook)
app.use("/api/product", product);

// Start express on the defined port
app.listen(PORT, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }

    console.log(`server is listening on ${PORT}`)
})
