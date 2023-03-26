import {findBranchInformation} from "../../services/helpers/KiotVietHelper.js";
import {baseVnConfig} from "../../settings/BaseVnConfig.js";
import {log} from "../../settings/logger.js";
import {checkIfJobExistInBaseVN} from "../../services/helpers/BaseVnHelper.js";
import axios from "axios";
import {getUrl} from "../../utils/getConfigsService.js";

export const handleOrderEventImpl = async (body) => {

    const raw_body = body;

    const ftilesBackendDevUrl = await getUrl('ftiles-backend-dev');

    const result = await axios({
        method: 'post',
        url: `${ftilesBackendDevUrl}/receiverPort/orderEvent`,
        data: {
            "data": JSON.stringify(body)
        }
    })

    return result;
}















// =========================================

