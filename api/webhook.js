const express = require("express");
const router = express.Router();

router.post('/', function(req, res) {
    // console.log('Received webhook request:', JSON.stringify(req.body));

    // Handle webhook
    handleWebhook(req, res).then(function (result) {
        console.log(result)
        res.status(200).send(result)
    })
});



const handleWebhook = async (req, res) => {
    const raw_body = req.body;
    console.log(`Received webhook request:' ${raw_body}`)
    const status = raw_body.Notifications[0].Action;
    const data = raw_body.Notifications[0].Data[0];
    const statusValue = await data.Status;
    const branchId = data.BranchId;
    const invoiceDetails = data.InvoiceDetails;
    const finalResult = null;
    let Response = null;


    const accessTokenDetails = {
        'scope': 'PublicApi.Access',
        'grant_type': 'client_credentials',
        'client_id': '57da04ba-f842-4973-a094-db44a168ecc6',
        'client_secret': '695DAFF42CFDCD9A73BA6B97683600363F257815'
    };

    let accessTokenFormBody = [];
    for (let property in accessTokenDetails) {
        let encodedKey = encodeURIComponent(property);
        let encodedValue = encodeURIComponent(accessTokenDetails[property]);
        accessTokenFormBody.push(encodedKey + "=" + encodedValue);
    }
    accessTokenFormBody = accessTokenFormBody.join("&");

    const accessTokenRequest = await fetch("https://id.kiotviet.vn/connect/token",{
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept": "application/json",
        },
        body: accessTokenFormBody
    })

    const accessTokenResponse = await accessTokenRequest.json()

    const branchRequest = await fetch("https://public.kiotapi.com/branches",{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Retailer": "ftiles",
            "Authorization": `Bearer ${accessTokenResponse.access_token}`
        }
    })

    const branchRequestResponse = await branchRequest.json();

    const daily = branchRequestResponse.data.filter(function (branch) {
        return branch.id === branchId;
    });

    const sdtDaily = daily[0].contactNumber;


    const details = {
        'access_token': '7283-VLEJHZCDNE3L6RPK7VUU84V274B7V2N3VEQAHATVWG6VH7U69N3FGQ8RSJNX5HFJ-JWUJYADAH6FS77KJVA53UJ3JXKYL72U8Z4JEDC3MZ7XLST93WQD8MR4C89XATV4H',
        'username': 'cuongdv',
        'creator_username': 'adminftiles',
        'followers': 'adminftiles',
        'workflow_id': '5252',
        'content': `${data.Description}`,
        'name': `Giao ${data.Code}`,
        'custom_so_hop_dong': data.Code,
        'custom_chi_tiet_don_dat_hang': data.Code,
        'custom_gia_tri_hop_dong': data.Total,
        'custom_nguoi_ban_hang': data.SoldByName,
        'custom_ten_khach_hang_dai_ly_': data.CustomerName,
        'custom_so_dien_thoai_dai_ly': sdtDaily,
        'custom_ngay_giao_hang-time': "14:28",
        'custom_ngay_giao_hang-date': "23/12/2022",
        'custom_ten_nguoi_nhan': data.InvoiceDelivery != null ? data.InvoiceDelivery.Receiver : "",
        'custom_dia_chi_nha': data.InvoiceDelivery != null ? data.InvoiceDelivery.Address : "",
        'custom_gia_tri_don_hang': data.Total,
        'stage_export': "Nhận Đơn Giao Hàng",
        'custom_don_hang_thuoc_phong_kinh_doanh': data.BranchName,
        'custom_so_dien_thoai_nguoi_nhan': data.InvoiceDelivery.ContactNumber
    };

    let formBody = [];
    for (let property in details) {
        let encodedKey = encodeURIComponent(property);
        let encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");



    if(statusValue != 2 && status.includes("update")){
        const Request = await fetch('https://workflow.base.vn/extapi/v1/job/create', {
            method: 'POST',
            headers:{
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formBody
        });

        Response = await Request.json();
    }

    console.log(Response);

    return {statusValue, Response};
}

module.exports = router;
