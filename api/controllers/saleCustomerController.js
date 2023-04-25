
import {handleGetAllSaleCustomerImpl, handleGetCustomersOfSpecificSaleImpl} from "../services/saleCustomerService.js";

export const handleGetAllSaleCustomers = async (req, res) => {
    const body = req.body;
    let result = {};
    result = await handleGetAllSaleCustomerImpl(body);

    return result;
}



export const handleGetCustomersOfSpecificSale = async (req, res) => {
    const saleId = req.params.saleId;
    let result = {};
    result = await handleGetCustomersOfSpecificSaleImpl(saleId);

    return result;
}
