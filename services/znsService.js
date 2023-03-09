import {znsConfig} from "../settings/ZnsConfig.js";
import {getZnsAccessToken} from "./helpers/ZnsHelper.js";
import {log} from "../settings/logger.js";

export const sendZnsDone = async function (doneZnsResponse, znsPhoneNumber ,orderId, customerName) {
    znsConfig.setZnsDoneTemplate( znsPhoneNumber ,orderId, customerName)

    const accessToken = await getZnsAccessToken();

    const createZnsRequest = await fetch('https://business.openapi.zalo.me/message/template', {
        method: 'POST',
        headers: {
            'access_token': accessToken,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(znsConfig.getZnsDone())
    });

    doneZnsResponse = await createZnsRequest.json();


    console.log(log(`ZNS RESPONSE: `+'\n' + `${JSON.stringify(doneZnsResponse)}\n`));
}



export const sendZnsXacNhanDonHang = async function (createZnsResponse, znsPhoneNumber, receiverPhoneNumber, customerPhoneNumber, orderCode, orderDate, customerName, giaTriDonHang, status) {

    znsConfig.setZnsCreateTemplate(znsPhoneNumber, orderCode, orderDate, receiverPhoneNumber, customerName, giaTriDonHang, status)
    const accessToken = await getZnsAccessToken();


    const createZnsRequest = await fetch('https://business.openapi.zalo.me/message/template', {
        method: 'POST',
        headers: {
            'access_token': accessToken,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(znsConfig.getZnsCreate())
    });

    createZnsResponse = await createZnsRequest.json();

    console.log(log(`ZNS RESPONSE: `+'\n' + `${JSON.stringify(createZnsResponse)}\n`));
}
