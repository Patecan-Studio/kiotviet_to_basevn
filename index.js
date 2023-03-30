import express from "express";
import bodyParser from "body-parser";

import webhookKiotRouter from "./api/routes/webhookKiotRoute.js";
import webhookBaseRouter  from "./api/routes/webhookBaseRoute.js";
import productRouter from "./api/routes/product.js";
import {log} from "./settings/logger.js";
import cors from 'cors';

const app = express()
app.use(cors())
const port = process.env.PORT || 3000;
const nodeEnv = process.env.NODE_ENV;
const mySetting = process.env.MY_SETTING;

// Tell express to use body-parser's JSON parsing
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/kiotviet/webhook", webhookKiotRouter)
app.use("/base/webhook", webhookBaseRouter)
app.use("/api/product", productRouter);


app.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }

    console.log(log(`server is listening on ${PORT}`));
})
