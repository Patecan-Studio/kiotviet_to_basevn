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
        refresh_token: '2yr2ISecZmfPr0W3hYQF7NtuLchU3_We4Fb5MBL7eYHDcNXSxLcAQIAhDM7FJkaOQRvpJPfzo0DeznjodIt21JZUHNl95VXp8F4Z2eq0X7vJqWysWa3gR3YCTrxBCAmFU85zGzS9_sTXyrXltnNR9IEL3bhIJD0gGAP6LAiaeMdlPK9DMwlLEFri1ceutkSZs65AD6tkt5YEU0m_S_hDDizrSnDW-gv8u6mT97NSgK98zMTyodIZ00',
        app_id: '4404942929062535266',
        grant_type: 'refresh_token'
    }

}

