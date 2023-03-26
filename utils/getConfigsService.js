import dateFormat from "dateformat";
import axios from "axios";

export async function getUrl(serviceName){
    let serverUrl = '';
    if(serviceName === 'ftiles-backend-dev'){
        serverUrl = 'ftiles_backend_dev_url';
    }

    try {

        console.log("SEND REQUESTING CONFIG-SERVICE");


        const response = (await axios.get(`https://ftiles-config-service.vercel.app/${serverUrl}`));
        console.log(response.data)
        if(response.status === 200){
            console.log(`RESPONSE FROM CONFIG-SERVICE ${response.data}`);
            return response.data;
        }
    }catch (e) {
        console.log(e)
        throw e;
    }
}
