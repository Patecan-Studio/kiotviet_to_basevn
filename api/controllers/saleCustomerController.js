
import {handleGetAllSaleCustomerImpl} from "../services/saleCustomerService.js";

export const handleGetAllSaleCustomers = async (req, res) => {
    const body = req.body;
    let result = {};
    result = await handleGetAllSaleCustomerImpl(body);

    return result;
}
