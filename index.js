import express from "express";
import bodyParser from "body-parser";

import webhookRouter from "./api/routes/webhookKiot.js";
import webhookBaseRouter  from "./api/routes/webhookBase.js";
import productRouter from "./api/routes/product.js";
import {log} from "./settings/logger.js";

const app = express()
const PORT = 3000

// Tell express to use body-parser's JSON parsing
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/", webhookRouter)
app.use("/base/webhook", webhookBaseRouter)
app.use("/api/product", productRouter);


app.listen(PORT, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }

    console.log(log(`server is listening on ${PORT}`));
})
