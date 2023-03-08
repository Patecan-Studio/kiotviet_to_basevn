import express from "express";
import {handleWebhookCreate, handleWebhookDone} from "../controllers/webhookBaseController.js";

const router = express.Router();

router.post('/create', function (req, res) {
    handleWebhookCreate(req, res).then(function (result) {
        console.log(result)
        res.status(200).send(result)
    })
});

router.post('/done', function (req, res) {
    handleWebhookDone(req, res).then(function (result) {
        console.log(result)
        res.status(200).send(result)
    })
});





export default router;
