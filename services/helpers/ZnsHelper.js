import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()
import {znsConfig} from "../../settings/ZnsConfig.js";
import fs from "fs";
import fetch from 'node-fetch'



export async function getZnsAccessToken(){
    let accessTokenFormBody = [];

    for (let property in znsConfig.znsAccessTokenDetails) {
        let encodedKey = encodeURIComponent(property);
        let encodedValue = encodeURIComponent(znsConfig.znsAccessTokenDetails[property]);
        accessTokenFormBody.push(encodedKey + "=" + encodedValue);
    }

    const refreshKey = await fs.promises.readFile('./resource/zns_key.txt');
    accessTokenFormBody.push("refresh_token" + "=" + refreshKey.toString().trim());
    accessTokenFormBody = accessTokenFormBody.join("&");

    const accessTokenRequest = await fetch("https://oauth.zaloapp.com/v4/oa/access_token",{
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept": "application/json",
            "secret_key": 'k78Dok4M8Ok3hGW3uR2M'
        },
        body: accessTokenFormBody
    })

    const accessTokenResponse = await accessTokenRequest.json();

    console.log("ZNS TOKEN: "+ JSON.stringify(accessTokenResponse));
    await fs.promises.writeFile('./resource/zns_key.txt',accessTokenResponse.refresh_token.toString().trim());

    return `${accessTokenResponse.access_token}`;

}
