import {findBranchInformation, findSaleInformation} from "../../services/helpers/KiotVietHelper.js";
import {baseVnConfig} from "../../settings/BaseVnConfig.js";
import {log} from "../../settings/logger.js";
import {checkIfJobExistInBaseVN, checkUserByEmail} from "../../services/helpers/BaseVnHelper.js";
import axios from "axios";
import {getUrl} from "../../utils/getConfigsService.js";

export const handleInvoiceEventImpl = async (body) => {

    const raw_body = body;
    const status = raw_body.Notifications[0].Action;
    const data = raw_body.Notifications[0].Data[0];
    const invoiceCode = data.Code;
    const statusValue = await data.Status;
    const branchId = data.BranchId;
    const invoiceDetails = data.InvoiceDetails;
    const finalResult = null;
    let createTaskBaseVNResponse = null;

    const sdtDaily = await findBranchInformation(branchId).contactNumber;
    const foundedSale = await findSaleInformation(data.SoldById);

    console.log("SALE ON KIOT: "+foundedSale);
    const saleOnBase = await checkUserByEmail(foundedSale.email);

    console.log("SALE ON BASE: "+saleOnBase);

    const baseVNBodyDetails = {
        'access_token': baseVnConfig.accessToken,
        'creator_username': baseVnConfig.creatorUsername,
        'followers': `@${saleOnBase.username}`,
        'username': '@cuongdv',
        'workflow_id': baseVnConfig.workflowId,
        'content': `${data.Description}`,
        'name': `${data.Code}`,
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
        'custom_so_dien_thoai_nguoi_nhan': data.InvoiceDelivery != null ? data.InvoiceDelivery.ContactNumber : ""
    }

    if (filterAgency(data.BranchId, data.CustomerId)) {

        if (filterBranch(data.BranchId)) {
            const isJobExistInBaseVN = await checkIfJobExistInBaseVN(data.Code);
            if (isJobExistInBaseVN === undefined) {
                console.log(log(`----> THIS IS NEW JOB <----`))
                await createTaskBaseVN(createTaskBaseVNResponse, statusValue, status, baseVNBodyDetails, invoiceCode);
            } else {
                await editTaskBaseVN(createTaskBaseVNResponse, statusValue, status, baseVNBodyDetails, isJobExistInBaseVN.id);
            }
        }

    }

    return {statusValue, createTaskBaseVNResponse};
}

const createTaskBaseVN = async function (createTaskBaseVNResponse, statusValue, status, details, invoiceCode) {
    let formBody = [];
    for (let property in details) {
        let encodedKey = encodeURIComponent(property);
        let encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    if (statusValue !== 2 && status.includes("update")) {
        const createTaskBaseVNRequest = await fetch('https://workflow.base.vn/extapi/v1/job/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formBody
        });

        createTaskBaseVNResponse = await createTaskBaseVNRequest.json();
    }

    console.log(log("CREATE JOB BaseVN: ") + '\n' + `${JSON.stringify(createTaskBaseVNResponse)}\n`);
}

const editTaskBaseVN = async function (editTaskBaseVNResponse, statusValue, status, updatedBodyDetails, taskId) {
    let formBody = [];
    for (let property in updatedBodyDetails) {
        let encodedKey = encodeURIComponent(property);
        let encodedValue = encodeURIComponent(updatedBodyDetails[property]);
        formBody.push(encodedKey + "=" + encodedValue);
        formBody.push("id" + "=" + taskId);
    }
    formBody = formBody.join("&");

    if (statusValue !== 2 && status.includes("update")) {
        const createTaskBaseVNRequest = await fetch('https://workflow.base.vn/extapi/v1/job/edit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formBody
        });

        editTaskBaseVNResponse = await createTaskBaseVNRequest.json();
    }

    console.log("Edit Job BaseVN: \n" + JSON.stringify(editTaskBaseVNResponse));
}


const deleteTaskBaseVN = async function (deleteTaskBaseVNResponse, updatedBodyDetails, taskId) {
    let formBody = [];
    for (let property in updatedBodyDetails) {
        let encodedKey = encodeURIComponent(property);
        let encodedValue = encodeURIComponent(updatedBodyDetails[property]);
        formBody.push(encodedKey + "=" + encodedValue);
        formBody.push("id" + "=" + taskId);
    }
    formBody = formBody.join("&");


    const deleteTaskBaseVNRequest = await fetch('', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formBody
    });

    deleteTaskBaseVNResponse = await deleteTaskBaseVNRequest.json();


    console.log("Delete Job BaseVN: \n" + JSON.stringify(editTaskBaseVNResponse));
}


const filterBranch = function (branchCode) {
    const acceptedBranch = [1000000114, 1000000115, 1000000136, 1000000131];
    return acceptedBranch.includes(branchCode);
}

const filterAgency = function (branchId, customerId) {
    const highestBranch = 1000000114;
    let hcmBranchCode = [1003114420, 1003094169];


    console.log(log(`CHECKING AGENCY:`) + ` branch ID: ${branchId} customer ID: ${customerId}`);

    if (branchId === highestBranch && hcmBranchCode.includes(customerId)) {
        return false;
    }

    return true;
}


// =========================================

export const createBaseJobManualImpl = async (req, res) => {
    const raw_body = req.body;
    console.log(`Received request:' ${JSON.stringify(raw_body)}`)
    const data = raw_body;
    const invoiceCode = data.code;
    const statusValue = data.status;
    const status = "update";
    const branchId = data.branchId;
    const invoiceDetails = data.invoiceDetails;
    const finalResult = null;
    let createTaskBaseVNResponse = null;

    const sdtDaily = await findBranchInformation(branchId).contactNumber;

    const baseVNBodyDetails = {
        'access_token': baseVnConfig.accessToken,
        'creator_username': baseVnConfig.creatorUsername,
        'followers': baseVnConfig.followers,
        'username': '@cuongdv',
        'workflow_id': baseVnConfig.workflowId,
        'content': `${data.description}`,
        'name': `${data.code}`,
        'custom_so_hop_dong': data.code,
        'custom_chi_tiet_don_dat_hang': data.code,
        'custom_gia_tri_hop_dong': data.total,
        'custom_nguoi_ban_hang': data.soldByName,
        'custom_ten_khach_hang_dai_ly_': data.customerName,
        'custom_so_dien_thoai_dai_ly': sdtDaily,
        'custom_ngay_giao_hang-time': "14:28",
        'custom_ngay_giao_hang-date': "23/12/2022",
        'custom_ten_nguoi_nhan': data.invoiceDelivery != null ? data.invoiceDelivery.receiver : "",
        'custom_dia_chi_nha': data.invoiceDelivery != null ? data.invoiceDelivery.Address : "",
        'custom_gia_tri_don_hang': data.total,
        'stage_export': "Nhận Đơn Giao Hàng",
        'custom_don_hang_thuoc_phong_kinh_doanh': data.branchName,
        'custom_so_dien_thoai_nguoi_nhan': data.invoiceDelivery != null ? data.invoiceDelivery.contactNumber : ""
    }

    if (filterAgency(data.branchId, data.customerCode)) {

        if (filterBranch(data.branchId)) {
            const isJobExistInBaseVN = await checkIfJobExistInBaseVN(data.Code);
            if (isJobExistInBaseVN === undefined) {
                console.log(log(`----> THIS IS NEW JOB <----`))
                await createTaskBaseVN(createTaskBaseVNResponse, statusValue, status, baseVNBodyDetails, invoiceCode);
            } else {
                console.log(log(`----> THIS IS EXISTED JOB <----`))
                await editTaskBaseVN(createTaskBaseVNResponse, statusValue, status, baseVNBodyDetails, isJobExistInBaseVN.id);
            }
        }

    }

    return {statusValue};
}
