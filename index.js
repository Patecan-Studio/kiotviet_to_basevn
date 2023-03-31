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

app.get("/", (req, res) => res.type('html').send(html));


app.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }
    console.log(log(`server is listening on ${port}`));
})



const html = `
<!DOCTYPE html>
<html>
  <head>
    <title>Patecan Studio Services</title>
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js"></script>
    <script>
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          disableForReducedMotion: true
        });
      }, 500);
    </script>
    <style>
      @import url("https://p.typekit.net/p.css?s=1&k=vnd5zic&ht=tk&f=39475.39476.39477.39478.39479.39480.39481.39482&a=18673890&app=typekit&e=css");
      @font-face {
        font-family: "neo-sans";
        src: url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff2"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("opentype");
        font-style: normal;
        font-weight: 700;
      }
      html {
        font-family: neo-sans;
        font-weight: 700;
        font-size: calc(62rem / 16);
      }
      body {
        background: white;
      }
      section {
        border-radius: 1em;
        padding: 1em;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-right: -50%;
        transform: translate(-50%, -50%);
      }
    </style>
  </head>
  <body>
    <section>
      Welcome to Patecan Studio.
    </section>
  </body>
</html>
`
