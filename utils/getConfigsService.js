import dateFormat from "dateformat";
import axios from "axios";

export async function getUrl(serviceName){
    let serverUrl = '';
    if(serviceName === 'ftiles-backend-dev'){
        serverUrl = 'ftiles_backend_dev_url';
    }

    try {

        console.log("Send event to Ftile BE");
        const config = {
            headers: {
                'Content-Type': 'application/json',
            }
        };

        const response = (await axios.get(`https://ftiles-config-service.vercel.app/${serverUrl}`, config));
        if(response.status === 200){
            return response.data;
        }
    }catch (e) {
        console.log(e)
        throw e;
    }
}
