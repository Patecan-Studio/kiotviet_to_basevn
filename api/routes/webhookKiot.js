import express from "express";
import {baseVnConfig} from "../../settings/BaseVnConfig.js";
import {createManual, handleWebhookInvoice} from "../controllers/webhookKiotController.js";
import {log} from "../../settings/logger.js";
import axios from "axios";

const router = express.Router();

router.post('/webhook', function(req, res) {

    console.log(log(`RECEIVED INVOICE WEBHOOK: `)+ '\n' +`${JSON.stringify(req.body)}` +'\n')

    let data = req.body;

    axios({
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        url: 'https://c6f26d81bc51.ngrok.app/receiverPort/invoiceEvent',
        data: {
            "data": "hello"
        }
    })

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
