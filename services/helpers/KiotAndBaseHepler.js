import {findSaleInformation} from "./KiotVietHelper.js";
import {checkUserByEmail} from "./BaseVnHelper.js";
import * as Sentry from "@sentry/node";

export const findBaseUsernameByKiotVietAccount = async function (userId){
    if (specialAccount(userId)){
        return specialAccount(userId);
    }


    let saleOnBaseUsername="adminftiles";
    try {
        const foundedSale = await findSaleInformation(data.SoldById);
        if(foundedSale.email !== undefined){
            saleOnBaseUsername = await checkUserByEmail(foundedSale.email);
        }
    } catch (e) {
        Sentry.captureException(e);
        throw new Error(e);
    }

    return saleOnBaseUsername;
}


function specialAccount(userId){
    const specialAccountsList = [1424987];
    if(specialAccountsList.includes(userId)){
        return "adminftiles";
    }
}
