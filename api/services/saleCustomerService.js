import {
    findBranchInformation,
    findSaleInformation,
    findSaleInformationTmp,
    getKiotAccessToken
} from "../../services/helpers/KiotVietHelper.js";
import {findBaseUsernameByKiotVietAccount} from "../../services/helpers/KiotAndBaseHepler.js";
import {baseVnConfig} from "../../settings/BaseVnConfig.js";
import {checkIfJobExistInBaseVN} from "../../services/helpers/BaseVnHelper.js";
import {log} from "../../settings/logger.js";
import fetch from "node-fetch";
import {kiotVietConfig} from "../../settings/KiotVietConfig.js";
import axios from "axios";

export const handleGetAllSaleCustomerImpl = async (body) => {
    let allCustomers = [];

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
        response = (await axios.get(`https://public.kiotapi.com/customers?currentItem=${currentItem}`, config)).data;
        data = data.concat(response.data);
        ++page;
        currentItem = (page*pageSize);
    } while (response.data.length > 0);

    const saleCustomersData = [];
    const saleObjRegExp = /\{[^\}]*sale[^\}]*\}/;
    for (const customer of data) {
        const comments = customer['comments'];
        if( comments !== undefined && comments !== "" && comments.match(saleObjRegExp)){
            const saleStrings = comments.match(saleObjRegExp);
            const saleObj = JSON.parse(saleStrings[0].replace(/(\w+):/g, '"$1":').replace(/:(\s*)(\w+)/, ':"$2"'));

            saleObj.customers = {
                id: customer.id,
                code: customer.code,
                name: customer.name,
                contactNumber: customer.contactNumber,
                organization: customer.organization,
                createDate: customer.createdDate
            };
            saleCustomersData.push(saleObj);
        }
        allCustomers.push(customer);
    }
    const result = (await groupCustomerOfSale(saleCustomersData));
    console.log(result)
    return result;
}


export async function groupCustomerOfSale(saleCustomersData){
    const groupedSaleInfoCustomerData = []



    const groupedSaleCustomerData = saleCustomersData.reduce((accumulatorObject, obj) => {
        const saleId = obj.sale;
        if (!accumulatorObject[saleId]) {
            accumulatorObject[saleId] = [];
        }
        accumulatorObject[saleId].push(obj.customers);
        return accumulatorObject;
    }, {});

    const saleIdsArray = Object.keys(groupedSaleCustomerData);

    const saleRequest = await fetch(`https://public.kiotapi.com/users?pageSize=100`,{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Retailer": kiotVietConfig.retailer,
            "Authorization": await getKiotAccessToken()
        }
    })

    const allSaleResponse = await saleRequest.json();

    allSaleResponse.data.forEach((saleInfo)=>{
        if(saleIdsArray.includes(saleInfo.id.toString())){
            let tmpObj = {}
            tmpObj['saleId'] = saleInfo.id;
            tmpObj['saleInfo'] = saleInfo;
            tmpObj['customers'] = groupedSaleCustomerData[saleInfo.id.toString()];
            groupedSaleInfoCustomerData.push(tmpObj);
            tmpObj = {};
        }
    });

    return groupedSaleInfoCustomerData;

}



async function storeRefreshToken(refreshToken) {
    let result=null;
    try {
        let redisClient = await getRedisClient();
        result = await redisClient.set('znsRefreshTokenKey', refreshToken);
    }catch (e) {
        throw new Error(e);
    }

    return result;
}

// Retrieve a refresh token
async function getRefreshToken() {
    let result=null;

    try {
        let redisClient = await getRedisClient();
        result = await redisClient.get('znsRefreshTokenKey');
        console.log("ZNS REFRESH TOKEN: "+ result);
    } catch (e) {
        throw new Error(e);
    }

    return result;
}




export const handleGetCustomersOfSpecificSaleImpl = async (saleId) => {

    let allCustomers = [];

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
        response = (await axios.get(`https://public.kiotapi.com/customers?currentItem=${currentItem}`, config)).data;
        data = data.concat(response.data);
        ++page;
        currentItem = (page*pageSize);
    } while (response.data.length > 0);

    const saleCustomersData = [];
    const saleObjRegExp = /\{[^\}]*sale[^\}]*\}/;
    for (const customer of data) {
        const comments = customer['comments'];
        if( comments !== undefined && comments !== "" && comments.match(saleObjRegExp)){
            const saleStrings = comments.match(saleObjRegExp);
            const saleObj = JSON.parse(saleStrings[0].replace(/(\w+):/g, '"$1":').replace(/:(\s*)(\w+)/, ':"$2"'));

            saleObj.customers = {
                id: customer.id,
                code: customer.code,
                name: customer.name,
                contactNumber: customer.contactNumber,
                organization: customer.organization,
                createDate: customer.createdDate
            };
            saleCustomersData.push(saleObj);
        }
        allCustomers.push(customer);
    }


    const result = (await groupCustomerOfSale(saleCustomersData)).filter((obj)=> obj.saleId == saleId);

    return result;
}

//(await handleGetCustomersOfSpecificSaleImpl(1438845))
