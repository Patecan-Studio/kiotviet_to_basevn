import {baseVnConfig} from "../../settings/BaseVnConfig.js";
import {log} from "../../settings/logger.js";
import {findSaleInformation} from "./KiotVietHelper.js";
import fetch from 'node-fetch'

export const checkIfJobExistInBaseVN = async function (invoiceCode){
    const baseVNBodyDetails = {
        'access_token': baseVnConfig.accessToken,
        'creator_username': baseVnConfig.creatorUsername,
        'workflow_id': baseVnConfig.workflowId,
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

    console.log(log(`CHECKING IN BaseVN ALL JOBS: `)+ '\n'+ JSON.stringify(allJobsName) + '\n')

    const foundDuplicatedJob = allJobsName.find((job) => job.name === invoiceCode);

    if(foundDuplicatedJob !== undefined){
        console.log(log(`FOUND DUPLICATED JOB: `)  + foundDuplicatedJob.name + foundDuplicatedJob.id );
    }

    return foundDuplicatedJob;
}


const checkIfInvoiceIsUpdatedOrDeleted = function (invoiceCode){

}


export async function checkUserByEmail(email){
    const baseVNBodyDetails = {
        'access_token': baseVnConfig.accessTokenAccount,
        'email': email,
    };

    let formBody = [];
    for (let property in baseVNBodyDetails) {
        let encodedKey = encodeURIComponent(property);
        let encodedValue = encodeURIComponent(baseVNBodyDetails[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    const createTaskBaseVNRequest = await fetch('https://account.base.vn/extapi/v1/user/search.by.email', {
        method: 'POST',
        headers:{
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formBody
    });

    const allUsersResponse = await createTaskBaseVNRequest.json();
    const foundUser = allUsersResponse.user;

    return foundUser.username;
}


