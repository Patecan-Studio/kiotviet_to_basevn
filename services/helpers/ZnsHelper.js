import {znsConfig} from "../../settings/ZnsConfig.js";


export async function getZnsAccessToken(){

    let accessTokenFormBody = [];

    for (let property in znsConfig.znsAccessTokenDetails) {
        let encodedKey = encodeURIComponent(property);
        let encodedValue = encodeURIComponent(znsConfig.znsAccessTokenDetails[property]);
        accessTokenFormBody.push(encodedKey + "=" + encodedValue);
    }
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

    return `${accessTokenResponse.access_token}`;
}
