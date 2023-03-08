import pdf from 'pdf-creator-node';
import fs from 'fs';
import path from "path";
import numberToTextVietnamese from 'number-to-text-vietnamese';
import dateFormat from "dateformat";





export async function createInvoice(invoiceCode){
    try {

        const html = fs.readFileSync('./resource/invoice.html', 'utf-8');

        const options = {
            format: "A3",
            orientation: "portrait",
            border: "10mm",
            footer: {
                contents: {
                    default: '<span style="color: #444;">{{page}}</span> of <span>{{pages}}</span>'
                }
            }
        };



        const _invoiceInfo = await findInvoiceInformation(invoiceCode);
        const branchInfo = await findBranchInformation(_invoiceInfo.branchId);
        const _saleInfo = await findSaleInformation(_invoiceInfo.soldById);




        let _products = _invoiceInfo.invoiceDetails.map(invoice => ({
            STT: _invoiceInfo.invoiceDetails.indexOf(invoice) + 1,
            Ten_Hang_Hoa: invoice.productName,
            Don_Vi_Tinh: "m2",
            So_Luong: invoice.quantity,
            Don_Gia_Sau_Chiet_Khau:( invoice.price - ( invoice.discount )).toLocaleString(),
            Thanh_Toan: invoice.subTotal.toLocaleString()
        }));

        let _tongTienHang = 0;
        let _tongLuongHang = 0;

         _invoiceInfo.invoiceDetails.forEach(invoiceDetails => {
            _tongTienHang += invoiceDetails.subTotal;
            _tongLuongHang += invoiceDetails.quantity;
        });


        const document = {
            html: html,
            data: {
                Ma_Don_Hang: _invoiceInfo.code,
                Ngay_Thang_Nam: formatDate(_invoiceInfo.createdDate),
                Nhan_Vien_Ban_Hang: _invoiceInfo.soldByName,
                Dia_Chi_Khach_Hang: _invoiceInfo.invoiceDelivery.address,
                Phuong_Xa_Khach_Hang: _invoiceInfo.invoiceDelivery.wardName,
                Khu_Vuc_Khach_Hang_QH_TP: _invoiceInfo.invoiceDelivery.locationName,
                Khach_Hang: _invoiceInfo.customerName,
                So_Dien_Thoai: _invoiceInfo.invoiceDelivery.contactNumber,
                Ghi_Chu: _invoiceInfo.description ?? "",
                Chiet_Khau_Hoa_Don_Phan_Tram: _invoiceInfo.discountRatio !== undefined ? _invoiceInfo.discountRatio+'%' : "",
                Chiet_Khau_Hoa_Don: _invoiceInfo.discount !== undefined ? _invoiceInfo.discount.toLocaleString(): "",
                Dien_Thoai_Nguoi_Ban: _saleInfo.mobilePhone,
                Tong_Cong_Bang_Chu: numberToTextVietnamese.getText(_invoiceInfo.total),
                Dia_Chi_Chi_Nhanh: branchInfo.address,
                Phuong_Xa_Chi_Nhanh: branchInfo.wardName ,
                Khu_Vuc_Chi_Nhanh_QH_TP: branchInfo.locationName ,
                Dien_Thoai_Chi_Nhanh: branchInfo.contactNumber ,
                Ngay: dateFormat(new Date(_invoiceInfo.createdDate),'dd'),
                Thang: dateFormat(new Date(_invoiceInfo.createdDate),'mm'),
                Nam: dateFormat(new Date(_invoiceInfo.createdDate),'yyyy'),
                Tong_Cong: _invoiceInfo.total.toLocaleString(),
                Tong_Tien_Hang: _tongTienHang.toLocaleString(),
                Tong_So_Luong: _tongLuongHang,
                products: _products
            },
            path: "./invoice.pdf",
            type: "",
        };



        const result = await pdf.create(document, options);
        console.log(result);
    } catch (err) {
        console.log(`Error making PDF: ${err}`);
    }

}

function formatDate(createdDate){
    var day= new Date(createdDate);
    day=dateFormat(day, "dd/mm/yyyy h:MM TT");
    return day;
}

export async function findBranchInformation(branchId){
    const kiotVietAccessTokenDetails = {
        'scope': 'PublicApi.Access',
        'grant_type': 'client_credentials',
        'client_id': '57da04ba-f842-4973-a094-db44a168ecc6',
        'client_secret': '695DAFF42CFDCD9A73BA6B97683600363F257815'
    };

    let accessTokenFormBody = [];
    for (let property in kiotVietAccessTokenDetails) {
        let encodedKey = encodeURIComponent(property);
        let encodedValue = encodeURIComponent(kiotVietAccessTokenDetails[property]);
        accessTokenFormBody.push(encodedKey + "=" + encodedValue);
    }
    accessTokenFormBody = accessTokenFormBody.join("&");

    const accessTokenRequest = await fetch("https://id.kiotviet.vn/connect/token",{
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept": "application/json",
        },
        body: accessTokenFormBody
    })

    const accessTokenResponse = await accessTokenRequest.json()

    const branchRequest = await fetch("https://public.kiotapi.com/branches",{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Retailer": "ftiles",
            "Authorization": `Bearer ${accessTokenResponse.access_token}`
        }
    })

    const branchRequestResponse = await branchRequest.json();

    const branchInfo = branchRequestResponse.data.filter(function (branch) {
        return branch.id === branchId;
    });

    return branchInfo[0];
}

async function findInvoiceInformation(invoiceCode){
    const kiotVietAccessTokenDetails = {
        'scope': 'PublicApi.Access',
        'grant_type': 'client_credentials',
        'client_id': '57da04ba-f842-4973-a094-db44a168ecc6',
        'client_secret': '695DAFF42CFDCD9A73BA6B97683600363F257815'
    };

    let accessTokenFormBody = [];
    for (let property in kiotVietAccessTokenDetails) {
        let encodedKey = encodeURIComponent(property);
        let encodedValue = encodeURIComponent(kiotVietAccessTokenDetails[property]);
        accessTokenFormBody.push(encodedKey + "=" + encodedValue);
    }
    accessTokenFormBody = accessTokenFormBody.join("&");

    const accessTokenRequest = await fetch("https://id.kiotviet.vn/connect/token",{
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept": "application/json",
        },
        body: accessTokenFormBody
    })

    const accessTokenResponse = await accessTokenRequest.json()

    const invoiceRequest = await fetch(`https://public.kiotapi.com/invoices/code/${invoiceCode}`,{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Retailer": "ftiles",
            "Authorization": `Bearer ${accessTokenResponse.access_token}`
        }
    })

    const invoiceRequestResponse = await invoiceRequest.json();

    const invoiceInfo = invoiceRequestResponse;

    console.log(invoiceInfo);

    return invoiceInfo;
}

export async function findSaleInformation(saleId){
    const kiotVietAccessTokenDetails = {
        'scope': 'PublicApi.Access',
        'grant_type': 'client_credentials',
        'client_id': '57da04ba-f842-4973-a094-db44a168ecc6',
        'client_secret': '695DAFF42CFDCD9A73BA6B97683600363F257815'
    };

    let accessTokenFormBody = [];
    for (let property in kiotVietAccessTokenDetails) {
        let encodedKey = encodeURIComponent(property);
        let encodedValue = encodeURIComponent(kiotVietAccessTokenDetails[property]);
        accessTokenFormBody.push(encodedKey + "=" + encodedValue);
    }
    accessTokenFormBody = accessTokenFormBody.join("&");

    const accessTokenRequest = await fetch("https://id.kiotviet.vn/connect/token",{
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept": "application/json",
        },
        body: accessTokenFormBody
    })

    const accessTokenResponse = await accessTokenRequest.json()

    const saleRequest = await fetch(`https://public.kiotapi.com/users`,{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Retailer": "ftiles",
            "Authorization": `Bearer ${accessTokenResponse.access_token}`
        }
    })

    const saleResponse = await saleRequest.json();

    const saleInfo = saleResponse.data.filter(function (sale) {
        return sale.id === saleId;
    });


    return saleInfo[0];
}

