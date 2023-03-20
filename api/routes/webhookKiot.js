import express from "express";
import {baseVnConfig} from "../../settings/BaseVnConfig.js";
import {createManual, handleWebhookInvoice} from "../controllers/webhookKiotController.js";
import {log} from "../../settings/logger.js";

const router = express.Router();

router.post('/webhook', function(req, res) {

    console.log(log(`RECEIVED INVOICE WEBHOOK: `)+ '\n' +`${JSON.stringify(req.body)}` +'\n')

    let body = JSON.stringify(req.body);
    fetch('https://c6f26d81bc51.ngrok.app/receiverPort/invoiceEvent', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: body
    }).then(r =>{
        console.log("ALREADY SENT WEBHOOK EVENT TO ftiles")
    });

    handleWebhookInvoice(req, res).then(function (result) {
        console.log(result)
        res.status(200).send(result)
    })
});


router.post('/manualCreate', function(req, res) {
    createManual(req, res).then(function (result) {
        console.log(result)
        res.status(200).send(result)
    })
});



export default router;
