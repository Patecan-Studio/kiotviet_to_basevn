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
        refresh_token: 'SdrGSg6baoOWP1eunQMJCGH8H56rZEG4QKbNOzx4lWixBMfhZDxsIL8UHrQZoPKu40uvLxp_jWvSHcfZkwom00jbFsdedOns4qfP6Ao8y7jWQNKahCYUQmGt3KxbkDW8H3e7K_c1Ys1TIB9Ci8HBOrSCbWIsv4Pd2ox8Il_q25TsOEvAgveJ24bcboFd0ILzDDp62-5bBG5miFyDxGf3V3xJapQT1aS82j2B4_rVJH1UMIPQncbheVU_B0',
        app_id: '4404942929062535266',
        grant_type: 'refresh_token',
    }

}

