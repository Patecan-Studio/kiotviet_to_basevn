import express from "express";
import bodyParser from "body-parser";

import webhookKiotRouter from "./api/routes/webhookKiotRoute.js";
import webhookBaseRouter  from "./api/routes/webhookBaseRoute.js";
import productRouter from "./api/routes/product.js";
import {log} from "./settings/logger.js";
import cors from 'cors';
import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/node";

const app = express()

Sentry.init({
    dsn: "https://2dee4d3c562d475f9e5735dc0dbb8b7d@o1162105.ingest.sentry.io/4504931122151424",
    debug: true,
    integrations: [
        new Sentry.Integrations.Http({ tracing: true }),
        new Tracing.Integrations.Express({ app }),
    ],
    tracesSampleRate: 1.0,
});
app.use(cors())


const port = process.env.PORT || 3000;
const nodeEnv = process.env.NODE_ENV;
const mySetting = process.env.MY_SETTING;

// Tell express to use body-parser's JSON parsing
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());
app.use(Sentry.Handlers.errorHandler());

app.use(function onError(err, req, res, next) {
    res.statusCode = err.statusCode;
    res.end(res.sentry + "\n");
});

app.use("/kiotviet/webhook", webhookKiotRouter)
app.use("/base/webhook", webhookBaseRouter)
app.use("/api/product", productRouter);


app.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }
    console.log(log(`server is listening on ${port}`));
})
