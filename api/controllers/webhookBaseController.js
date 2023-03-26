import dateFormat from "dateformat";
import {createInvoice} from "../../services/invoiceFileService.js";
import {uploadInvoice} from "../../storage/invoice_storage.js";
import {sendZnsDone, sendZnsXacNhanDonHang} from "../../services/znsService.js";
import {log} from "../../settings/logger.js";

export const handleWebhookCreate = async (req, res) => {
    const raw_body = req.body;

    let sendZnsResponse = null;
    const orderCode = raw_body.gen_name;
    const receiverPhoneNumber = raw_body.custom_so_dien_thoai_nguoi_nhan;
    const customerPhoneNumber = raw_body.custom_so_dien_thoai_dai_ly;
    const customerName = raw_body.custom_ten_khach_hang_dai_ly_;
    const orderDate = dateFormat(new Date(0).setUTCSeconds(raw_body.stage_start), "dd/mm/yyyy");
    const giaTriDonHang = Number(raw_body.custom_gia_tri_don_hang)
    const znsPhoneNumber = '84909801090';

    console.log(log(`CREATE INVOICE PDF: `));
    await createInvoice(orderCode);

    console.log(log(`UPLOAD INVOICE PDF TO CLOUD: `));
    await uploadInvoice(orderCode, receiverPhoneNumber);


    console.log(log(`SEND ZNS XAC NHAN DON HANG: `));
    await sendZnsXacNhanDonHang(sendZnsResponse, znsPhoneNumber, receiverPhoneNumber,customerPhoneNumber, orderCode, orderDate, customerName ,giaTriDonHang, "Đã nhận đơn hàng");

    return {sendZnsResponse};
}

export const handleWebhookDone = async (req, res) => {
    const raw_body = req.body;

    let sendZnsResponse = null;
    const orderCode = raw_body.gen_name;
    const customerName = raw_body.custom_ten_khach_hang_dai_ly_;
    const znsPhoneNumber = '84949491968';

    console.log(log(`SEND ZNS DONE: `));
    await sendZnsDone(sendZnsResponse, znsPhoneNumber, orderCode, customerName);

    return {sendZnsResponse};
}

