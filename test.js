import axios from "axios";

axios({
    method: 'post',
    headers: {
        'Content-Type': 'application/json'
    },
    url: 'https://c6f26d81bc51.ngrok.app/receiverPort/invoiceEvent',
    data: {
        "data": "hello"
    }
})
