import {findBranchInformation} from "../../services/helpers/KiotVietHelper.js";
import {baseVnConfig} from "../../settings/BaseVnConfig.js";
import {log} from "../../settings/logger.js";
import {checkIfJobExistInBaseVN} from "../../services/helpers/BaseVnHelper.js";
import axios from "axios";
import {getUrl} from "../../utils/getConfigsService.js";

export const handleOrderEventImpl = async (body) => {

    const raw_body = body;


    await axios({
        method: 'post',
        url: `https://341d20aad966.ngrok.app/receiverPort/orderEvent`,
        data: {
            "data": JSON.stringify(body)
        }
    })


    return "good";
}















// =========================================

