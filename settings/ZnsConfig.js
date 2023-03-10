import * as dotenv from 'dotenv'
// see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-importdotenv.config()


export const znsConfig = {
    znsPhoneNumber: "",
    orderCode: "",
    orderDate: "",
    receiverPhoneNumber: "",
    customerName: "",
    giaTriDonHang: "",
    status: "",
    setZnsDoneTemplate(znsPhoneNumber, orderId, customerName) {
        this.znsPhoneNumber = znsPhoneNumber;
        this.orderId = orderId;
        this.customerName = customerName;
    },
    setZnsCreateTemplate(znsPhoneNumber, orderCode, orderDate, receiverPhoneNumber, customerName, giaTriDonHang, status) {
        this.znsPhoneNumber = znsPhoneNumber;
        this.orderCode = orderCode;
        this.orderDate = orderDate;
        this.receiverPhoneNumber = receiverPhoneNumber;
        this.customerName = customerName;
        this.giaTriDonHang = giaTriDonHang;
        this.status = status;
    },
    getZnsDone() {
        const znsDone = {
            phone: this.znsPhoneNumber,
            template_id: "246871",
            template_data: {
                order_id: this.orderId,
                customer_name: this.customerName
            },
            "tracking_id": "patecan2669"
        };

        return znsDone;
    },
    getZnsCreate() {
        const znsCreate = {
            phone: this.znsPhoneNumber,
            template_id: "248481",
            template_data: {
                order_code: this.orderCode,
                order_date: this.orderDate,
                customer_phone_number: this.receiverPhoneNumber,
                customer_name: this.customerName,
                value: this.giaTriDonHang,
                status: this.status
            },
            tracking_id: "patecan260699"
        };

        return znsCreate;
    },
    znsAccessTokenDetails: {
        app_id: '4404942929062535266',
        grant_type: 'refresh_token',
    }

}

