import {findBranchInformation} from "../../services/helpers/KiotVietHelper.js";
import {baseVnConfig} from "../../settings/BaseVnConfig.js";
import {log} from "../../settings/logger.js";
import {checkIfJobExistInBaseVN} from "../../services/helpers/BaseVnHelper.js";
import axios from "axios";
import {getUrl} from "../../utils/getConfigsService.js";
import {createBaseJobManualImpl, handleInvoiceEventImpl} from "../services/webhookKiotInvoiceService.js";
import {handleOrderEventImpl} from "../services/webhookKiotService.js";

export const handleInvoiceEvent = async (req, res) => {

    const body = req.body;
    let result = {};

    if(req.statusCode>=200 && req.statusCode<300){
        getUrl('ftiles-backend-dev').then((ftilesBackendDevUrl)=>{
            axios({
                method: 'post',
                url: `${ftilesBackendDevUrl}/receiverPort/invoiceEvent`,
                data: {
                    "data": JSON.stringify(req.body)
                }
            })
        })
    } else {
        console.log(req.statusCode);
    }

    result = await handleInvoiceEventImpl(body);

    return result;
}

export const handleOrderEvent = async (req, res) => {

    const body = req.body;
    let result = {};

    getUrl('ftiles-backend-dev').then((ftilesBackendDevUrl)=>{
        axios({
            method: 'post',
            url: `${ftilesBackendDevUrl}/receiverPort/orderEvent`,
            data: {
                "data": JSON.stringify(req.body)
            }
        })
    })


    result = await handleOrderEventImpl(body);

    return result;
}


export const createBaseJobManual = async (req, res) => {

    const body = req.body;
    let result = {};

    result = await createBaseJobManualImpl(body);

    return result;
}
