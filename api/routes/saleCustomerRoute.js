import express from "express";
import {handleGetAllSaleCustomers, handleGetCustomersOfSpecificSale} from "../controllers/saleCustomerController.js";

const router = express.Router();

router.get('/getAllSaleCustomers', async function(req, res) {

    await handleGetAllSaleCustomers(req, res).then(function (result) {
        console.log(result)
        res.status(200).send(result)
    })
});


router.get('/getSaleCustomers/:saleId', async function(req, res) {

    await handleGetCustomersOfSpecificSale(req, res).then(function (result) {
        console.log(result)
        res.status(200).send(result)
    })
});


export default router;
