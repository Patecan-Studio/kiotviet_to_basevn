import express from "express";
import {createInvoice} from "../invoice_processor/invoice_processor.js";
import {uploadInvoice} from "../storage/invoice_storage.js";
import dateFormat from "dateformat";

const router = express.Router();

router.post('/create', function (req, res) {
    // Handle webhook
    handleWebhookCreate(req, res).then(function (result) {
        console.log(result)
        res.status(200).send(result)
    })
});

router.post('/done', function (req, res) {
    // Handle webhook
    handleWebhookDone(req, res).then(function (result) {
        console.log(result)
        res.status(200).send(result)
    })
});


const handleWebhookCreate = async (req, res) => {
    const raw_body = req.body;
    console.log(`Received BaseVN webhook request:' ${JSON.stringify(raw_body)}`)

    let sendZnsResponse = null;
    const orderCode = raw_body.gen_name;
    const receiverPhoneNumber = raw_body.custom_so_dien_thoai_nguoi_nhan;
    const customerPhoneNumber = raw_body.custom_so_dien_thoai_dai_ly;
    const customerName = raw_body.custom_ten_khach_hang_dai_ly_;
    const orderDate = dateFormat(new Date(0).setUTCSeconds(raw_body.stage_start), "dd/mm/yyyy");
    const giaTriDonHang = Number(raw_body.custom_gia_tri_don_hang)
    const znsPhoneNumber = '84909801090';

    await createInvoice(orderCode);
    await uploadInvoice(orderCode, receiverPhoneNumber);

    //await sendZnsXacNhanDonHang(sendZnsResponse, znsPhoneNumber, receiverPhoneNumber,customerPhoneNumber, orderCode, orderDate, customerName ,giaTriDonHang, "Đã nhận đơn hàng");

    return {sendZnsResponse};
}

const handleWebhookDone = async (req, res) => {
    const raw_body = req.body;
    console.log(`Received BaseVN webhook request:' ${JSON.stringify(raw_body)}`)

    let sendZnsResponse = null;
    const orderCode = raw_body.gen_name;
    const customerName = raw_body.custom_ten_khach_hang_dai_ly_;
    const znsPhoneNumber = '84949491968';

    await sendZnsDone(sendZnsResponse, znsPhoneNumber, orderCode, customerName);

    return {sendZnsResponse};
}


const sendZnsXacNhanDonHang = async function (createZnsResponse, znsPhoneNumber, receiverPhoneNumber, customerPhoneNumber, orderCode, orderDate, customerName, giaTriDonHang, status) {
    const znsBodyDetails = {
        phone: znsPhoneNumber,
        template_id: "248481",
        template_data: {
            order_code: orderCode,
            order_date: orderDate,
            customer_phone_number: receiverPhoneNumber,
            customer_name: customerName,
            value: giaTriDonHang,
            status: status
        },
        tracking_id: "patecan260699"
    }


    const createZnsRequest = await fetch('https://business.openapi.zalo.me/message/template', {
        method: 'POST',
        headers: {
            'access_token': 'QjI_G2GG30vesRHD9XyC0clQj4uZ15TZ2TcSOoySJ40fk_5W7nCNBYocs0SL9WCgCPNRF3OgE0mcwU4S6quD1mgFp4bD3nnaVhkdCsOT7W9DXg8jLHjE71gfa1yHFcCk1FxS0mXQBXeumVPDBq54S3Rtdtq0DsKrCeMvDdKgHIXIa_eUJW04L5UukaXkCdD69vIzHXqTMdiWf8D4Anzi2n-7h1LK0turQuIw6a8iU09nxPOkVLTl47NMf197G6CD2FNS0Xap1JG9hVe37XOS01gero0n3Grk99BkJ6fIDrrNoFX27diaRrNxpIDiL10CNSV2C6WFVHv1if8zHtxmYdeW2W4E',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(znsBodyDetails)
    });

    createZnsResponse = await createZnsRequest.json();

    console.log("Send ZNS response: \n" + JSON.stringify(createZnsResponse));
}


const sendZnsDone = async function (createZnsResponse, znsPhoneNumber ,orderId, customerName) {
    const znsBodyDetails = {
        "phone": znsPhoneNumber,
        "template_id": "246871",
        "template_data": {
            "order_id": orderId,
            "customer_name": customerName
        },
        "tracking_id": "patecan2669"
    }

    const createZnsRequest = await fetch('https://business.openapi.zalo.me/message/template', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'access_token': 'QjI_G2GG30vesRHD9XyC0clQj4uZ15TZ2TcSOoySJ40fk_5W7nCNBYocs0SL9WCgCPNRF3OgE0mcwU4S6quD1mgFp4bD3nnaVhkdCsOT7W9DXg8jLHjE71gfa1yHFcCk1FxS0mXQBXeumVPDBq54S3Rtdtq0DsKrCeMvDdKgHIXIa_eUJW04L5UukaXkCdD69vIzHXqTMdiWf8D4Anzi2n-7h1LK0turQuIw6a8iU09nxPOkVLTl47NMf197G6CD2FNS0Xap1JG9hVe37XOS01gero0n3Grk99BkJ6fIDrrNoFX27diaRrNxpIDiL10CNSV2C6WFVHv1if8zHtxmYdeW2W4E'
        },
        body: JSON.stringify(znsBodyDetails)
    });

    createZnsResponse = await createZnsRequest.json();


    console.log("Send ZNS response: \n" + JSON.stringify(createZnsResponse));
}


export default router;
