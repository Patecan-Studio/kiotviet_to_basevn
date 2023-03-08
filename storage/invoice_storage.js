import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes} from "firebase/storage";
import fs from "fs";


const firebaseConfig = {
    apiKey: "AIzaSyD7QrUwf3xHHf82ViKpbFedZmGOYWiwL6U",
    authDomain: "ftiles-portal.firebaseapp.com",
    projectId: "ftiles-portal",
    storageBucket: "ftiles-portal.appspot.com",
    messagingSenderId: "575342186688",
    appId: "1:575342186688:web:037170e058ebae065d5d25",
    measurementId: "G-C685ZF1TVR"
};

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


