import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes} from "firebase/storage";
import {firebaseConfig} from "../settings/FirebaseConfig.js";
import fs from "fs";


// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Cloud Storage and get a reference to the service
const storage = getStorage(app);


export async function uploadInvoice(orderCode, customerPhoneNumber){
    const invoiceRef = ref(storage, `invoice/${orderCode}_${customerPhoneNumber}.pdf`);

    const file = fs.readFileSync("./invoice.pdf");

    const metadata = {
        contentType: 'application/pdf',
    };


    await uploadBytes(invoiceRef, file, metadata);

    fs.unlink('./invoice.pdf', (err) => {
        if (err) {
            throw err;
        }
    });
}


