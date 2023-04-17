import express from "express";
import {handleGetAllSaleCustomers} from "../controllers/saleCustomerController.js";

const router = express.Router();

router.get('/getAllSaleCustomers', async function(req, res) {

    await handleGetAllSaleCustomers(req, res).then(function (result) {
        console.log(result)
        res.status(200).send(result)
    })
});



export default router;
