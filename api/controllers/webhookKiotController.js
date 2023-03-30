import {findBranchInformation} from "../../services/helpers/KiotVietHelper.js";
import {baseVnConfig} from "../../settings/BaseVnConfig.js";
import {log} from "../../settings/logger.js";
import {checkIfJobExistInBaseVN} from "../../services/helpers/BaseVnHelper.js";
import axios from "axios";
import {getUrl} from "../../utils/getConfigsService.js";
import {createBaseJobManualImpl, handleInvoiceEventImpl} from "../services/webhookKiotInvoiceService.js";
import {handleOrderEventImpl} from "../services/webhookKiotOrderService.js";
import {handleStockEventImpl} from "../services/webhookKiotStockService.js";

export const handleInvoiceEvent = async (req, res) => {
    const body = req.body;
    let result = {};

    const ftilesBackendDevUrl = "https://ftiles.herokuapp.com";
    try {
        const response = await axios({
            method: 'post',
            url: `${ftilesBackendDevUrl}/receiverPort/kiotVietEvent`,
            data: {
                "eventType": "invoice_event",
                "data": JSON.stringify(req.body)
            }
        })
        console.log(response.data)

    } catch (e) {
        throw e;
    }


    result = await handleInvoiceEventImpl(body);

    return result;
}

export const handleOrderEvent = async (req, res) => {

    const body = req.body;
    let result = {};

    const ftilesBackendDevUrl = await getUrl('ftiles-backend-dev');

    try {
        const response = await axios({
            method: 'post',
            url: `${ftilesBackendDevUrl}/receiverPort/kiotVietEvent`,
            data: {
                "eventType": "order_event",
                "data": JSON.stringify(req.body)
            }
        })
        console.log(response.data)

    } catch (e) {
        throw e;
    }


    result = await handleOrderEventImpl(body);

    return result;
}

export const handleStockEvent = async (req, res) => {
    const body = req.body;
    let result = {};

    const ftilesBackendDevUrl = await getUrl('ftiles-backend-dev');
    try {
        const response = await axios({
            method: 'post',
            url: `${ftilesBackendDevUrl}/receiverPort/kiotVietEvent`,
            data: {
                "eventType": "stock_event",
                "data": JSON.stringify(req.body)
            }
        })
        console.log(response.data)

    } catch (e) {
        throw e;
    }

    result = await handleStockEventImpl(body);

    return result;
}


export const createBaseJobManual = async (req, res) => {

    const body = req.body;
    let result = {};

    result = await createBaseJobManualImpl(body);

    return result;
}
