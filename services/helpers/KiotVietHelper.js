import {kiotVietConfig} from "../../settings/KiotVietConfig.js";
import fetch from 'node-fetch';
import axios from "axios";


export async function getKiotAccessToken(){

    let accessTokenFormBody = [];
    for (let property in kiotVietConfig.kiotVietAccessTokenDetails) {
        let encodedKey = encodeURIComponent(property);
        let encodedValue = encodeURIComponent(kiotVietConfig.kiotVietAccessTokenDetails[property]);
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

    return `Bearer ${accessTokenResponse.access_token}`
}





export async function findBranchInformation(branchId){
    let allBranches = [];

    let pageSize = 100;
    let currentItem = 0;
    let page = 0;
    let data = [];
    let response = null;


    const config = {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Retailer": kiotVietConfig.retailer,
            "Authorization": await getKiotAccessToken()
        },
        params: {
            pageSize: pageSize
        }
    };

    do {
        response = (await axios.get(`https://public.kiotapi.com/branches?currentItem=${currentItem}`, config)).data;
        data = data.concat(response.data);
        ++page;
        currentItem = (page*pageSize);
    } while (response.data.length > 0);


    data.forEach((branch)=>{
        allBranches.push(branch);
    })


    const branchInfo = data.filter(function (branch) {
        return branch.id === branchId;
    });

    console.log(`BRANCH INFO: ${JSON.stringify(branchInfo[0])}`);
    return branchInfo[0];
}





export async function findInvoiceInformation(invoiceCode){

    const invoiceRequest = await fetch(`https://public.kiotapi.com/invoices/code/${invoiceCode}`,{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Retailer": kiotVietConfig.retailer,
            "Authorization": await getKiotAccessToken()
        }
    })

    const invoiceInfo = await invoiceRequest.json();

    console.log(invoiceInfo);

    return invoiceInfo;
}

export async function findSaleInformation(saleId){

    const saleRequest = await fetch(`https://public.kiotapi.com/users?pageSize=100`,{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Retailer": kiotVietConfig.retailer,
            "Authorization": await getKiotAccessToken()
        }
    })

    const saleResponse = await saleRequest.json();
    const saleInfo = saleResponse.data.filter(function (sale) {
        return sale.id === saleId;
    });

    return saleInfo[0];
}

export async function findSaleInformationTmp(saleId){

    const saleRequest = await fetch(`https://public.kiotapi.com/users?pageSize=100`,{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Retailer": kiotVietConfig.retailer,
            "Authorization": await getKiotAccessToken()
        }
    })

    const saleResponse = await saleRequest.json();
    console.log(saleResponse)
    const saleInfo = saleResponse.data.filter(function (sale) {
        return sale.id === saleId;
    });

    return saleInfo[0];
}

