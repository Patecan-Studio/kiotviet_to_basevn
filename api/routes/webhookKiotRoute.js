import express from "express";
import {baseVnConfig} from "../../settings/BaseVnConfig.js";
import {createBaseJobManual, handleInvoiceEvent, handleOrderEvent} from "../controllers/webhookKiotController.js";
import {log} from "../../settings/logger.js";
import axios from "axios";

const router = express.Router();

router.post('/invoice/update', function(req, res) {

    console.log(log(`LOG WEBHOOK DATA: `)+ '\n' +`${req}` +'\n');
    console.log(log(`RECEIVED INVOICE WEBHOOK: `)+ '\n' +`${JSON.stringify(req.body)}` +'\n')

    handleInvoiceEvent(req, res).then(function (result) {
        console.log(result)
        res.status(200).send(result)
    })
});

router.post('/order/update', function(req, res) {

    console.log(log(`RECEIVED ORDER WEBHOOK: `)+ '\n' +`${JSON.stringify(req.body)}` +'\n')

    handleOrderEvent(req, res).then(function (result) {
        console.log(result)
        res.status(200).send(result)
    })
});

router.post('/stock/update', function(req, res) {

    console.log(log(`LOG WEBHOOK DATA: `)+ '\n' +`${req}` +'\n');
    console.log(log(`RECEIVED INVOICE WEBHOOK: `)+ '\n' +`${JSON.stringify(req.body)}` +'\n')

    handleInvoiceEvent(req, res).then(function (result) {
        console.log(result)
        res.status(200).send(result)
    })
});


router.post('/manualCreate', function(req, res) {
    createBaseJobManual(req, res).then(function (result) {
        console.log(result)
        res.status(200).send(result)
    })
});



export default router;
