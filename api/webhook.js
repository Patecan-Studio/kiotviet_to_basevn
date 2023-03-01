const express = require("express");
const router = express.Router();

router.post('/', function(req, res) {
    // Handle webhook
    handleWebhook(req, res).then(function (result) {
        console.log(result)
        res.status(200).send(result)
    })
});



const handleWebhook = async (req, res) => {
    const raw_body = req.body;
    console.log(`Received webhook request:' ${JSON.stringify(raw_body)}`)
    const status = raw_body.Notifications[0].Action;
    const data = raw_body.Notifications[0].Data[0];
    const statusValue = await data.Status;
    const branchId = data.BranchId;
    const invoiceDetails = data.InvoiceDetails;
    const finalResult = null;
    let createTaskBaseVNResponse = null;


    const kiotVietAccessTokenDetails = {
        'scope': 'PublicApi.Access',
        'grant_type': 'client_credentials',
        'client_id': '57da04ba-f842-4973-a094-db44a168ecc6',
        'client_secret': '695DAFF42CFDCD9A73BA6B97683600363F257815'
    };

    let accessTokenFormBody = [];
    for (let property in kiotVietAccessTokenDetails) {
        let encodedKey = encodeURIComponent(property);
        let encodedValue = encodeURIComponent(kiotVietAccessTokenDetails[property]);
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


    const baseVNBodyDetails = {
        'access_token': '7283-VLEJHZCDNE3L6RPK7VUU84V274B7V2N3VEQAHATVWG6VH7U69N3FGQ8RSJNX5HFJ-JWUJYADAH6FS77KJVA53UJ3JXKYL72U8Z4JEDC3MZ7XLST93WQD8MR4C89XATV4H',
        'creator_username': 'adminftiles',
        'followers': 'adminftiles',
        'workflow_id': '5252',
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

    if(filterAgency(data.BranchName, data.CustomerCode)){
        if(filterBranch(data.BranchName)){
            const isJobExistInBaseVN = await checkIfJobExistInBaseVN(data.Code);
            if(isJobExistInBaseVN === undefined){
                await createTaskBaseVN(createTaskBaseVNResponse, statusValue, status, baseVNBodyDetails);
            } else {
                await editTaskBaseVN(createTaskBaseVNResponse, statusValue, status, baseVNBodyDetails, isJobExistInBaseVN.id);
            }
        }
    }

    return {statusValue, createTaskBaseVNResponse};
}

const createTaskBaseVN = async function (createTaskBaseVNResponse, statusValue, status, details) {
    let formBody = [];
    for (let property in details) {
        let encodedKey = encodeURIComponent(property);
        let encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    if(statusValue !== 2 && status.includes("update")){
        const createTaskBaseVNRequest = await fetch('https://workflow.base.vn/extapi/v1/job/create', {
            method: 'POST',
            headers:{
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formBody
        });

        createTaskBaseVNResponse = await createTaskBaseVNRequest.json();
    }

    console.log("Create Job BaseVN response: \n" + JSON.stringify(createTaskBaseVNResponse));
}

const editTaskBaseVN = async function (editTaskBaseVNResponse, statusValue, status, updatedBodyDetails, taskId) {
    let formBody = [];
    for (let property in updatedBodyDetails) {
        let encodedKey = encodeURIComponent(property);
        let encodedValue = encodeURIComponent(updatedBodyDetails[property]);
        formBody.push(encodedKey + "=" + encodedValue);
        formBody.push("id" + "="+ taskId);
    }
    formBody = formBody.join("&");

    if(statusValue !== 2 && status.includes("update")){
        const createTaskBaseVNRequest = await fetch('https://workflow.base.vn/extapi/v1/job/edit', {
            method: 'POST',
            headers:{
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formBody
        });

        editTaskBaseVNResponse = await createTaskBaseVNRequest.json();
    }

    console.log("Edit Job BaseVN: \n" + JSON.stringify(editTaskBaseVNResponse));
}

const checkIfJobExistInBaseVN = async function (jobId){
    const baseVNBodyDetails = {
        'access_token': '7283-VLEJHZCDNE3L6RPK7VUU84V274B7V2N3VEQAHATVWG6VH7U69N3FGQ8RSJNX5HFJ-JWUJYADAH6FS77KJVA53UJ3JXKYL72U8Z4JEDC3MZ7XLST93WQD8MR4C89XATV4H',
        'creator_username': 'adminftiles',
        'workflow_id': '5252',
        'status': 'active'
    };


    let formBody = [];
    for (let property in baseVNBodyDetails) {
        let encodedKey = encodeURIComponent(property);
        let encodedValue = encodeURIComponent(baseVNBodyDetails[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    const createTaskBaseVNRequest = await fetch('https://workflow.base.vn/extapi/v1/jobs/get', {
        method: 'POST',
        headers:{
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formBody
    });

   const allJobsResponse = await createTaskBaseVNRequest.json();
   const allJobs = allJobsResponse.jobs;

    const allJobsName = allJobs.map((job) => {
        let name = job.name
        let id = job.id
        return { name, id };
    });

    console.log("All Jobs from BaseVN: \n"+ JSON.stringify(allJobsName))

    const foundDuplicatedJob = allJobsName.find((job) => job.name === jobId);

    if(foundDuplicatedJob !== undefined){
        console.log("DUPLICATED JOB: "+ foundDuplicatedJob.name + foundDuplicatedJob.id );
    }

    return foundDuplicatedJob;
}

const deleteTaskBaseVN = async function (deleteTaskBaseVNResponse, updatedBodyDetails, taskId) {
    let formBody = [];
    for (let property in updatedBodyDetails) {
        let encodedKey = encodeURIComponent(property);
        let encodedValue = encodeURIComponent(updatedBodyDetails[property]);
        formBody.push(encodedKey + "=" + encodedValue);
        formBody.push("id" + "="+ taskId);
    }
    formBody = formBody.join("&");


        const deleteTaskBaseVNRequest = await fetch('', {
            method: 'POST',
            headers:{
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formBody
        });

    deleteTaskBaseVNResponse = await deleteTaskBaseVNRequest.json();


    console.log("Delete Job BaseVN: \n" + JSON.stringify(editTaskBaseVNResponse));
}



const filterBranch = function (branchName){
    const acceptedBranch = ["Hồ Chí Minh 1 (Đại lý)", "Hồ Chí Minh 2 ( Thiết Kế )", "Hồ Chí Minh 3 (Showroom )"]
    return acceptedBranch.includes(branchName);
}

const filterAgency = function (branchName, customerBranchCode){
    const highestBranch = "Kho Tổng Miền Nam";
    const hcmBranchCodes = ["HCM 1", "HCM 2", "HCM 3"]

    if(branchName.trim().toLowerCase() === highestBranch.trim().toLowerCase() && hcmBranchCodes.includes(customerBranchCode)){
        return false;
    }

    return true;
}


module.exports = router;
