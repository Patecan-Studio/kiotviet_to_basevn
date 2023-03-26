import express from "express";
import bodyParser from "body-parser";

import webhookKiotRouter from "./api/routes/webhookKiotRoute.js";
import webhookBaseRouter  from "./api/routes/webhookBaseRoute.js";
import productRouter from "./api/routes/product.js";
import {log} from "./settings/logger.js";

const app = express()
const PORT = 3000

// Tell express to use body-parser's JSON parsing
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/kiotviet/webhook", webhookKiotRouter)
app.use("/base/webhook", webhookBaseRouter)
app.use("/api/product", productRouter);


app.listen(PORT, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }

    console.log(log(`server is listening on ${PORT}`));
})
