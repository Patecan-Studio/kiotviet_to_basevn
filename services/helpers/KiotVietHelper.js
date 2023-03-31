import {kiotVietConfig} from "../../settings/KiotVietConfig.js";


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
    const branchRequest = await fetch("https://public.kiotapi.com/branches",{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Retailer": kiotVietConfig.retailer,
            "Authorization": await getKiotAccessToken()
        }
    })

    const branchRequestResponse = await branchRequest.json();

    const branchInfo = branchRequestResponse.data.filter(function (branch) {
        return branch.id === branchId;
    });

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

    console.log(saleInfo[0]);
    return saleInfo[0];
}

