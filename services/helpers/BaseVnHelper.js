import {baseVnConfig} from "../../settings/BaseVnConfig.js";
import {log} from "../../settings/logger.js";

export const checkIfJobExistInBaseVN = async function (jobId){
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

    const foundDuplicatedJob = allJobsName.find((job) => job.name === jobId);

    if(foundDuplicatedJob !== undefined){
        console.log(log(`FOUND DUPLICATED JOB: `)  + foundDuplicatedJob.name + foundDuplicatedJob.id );
    }

    return foundDuplicatedJob;
}