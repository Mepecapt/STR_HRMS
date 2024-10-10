import { doc, setDoc, updateDoc } from "firebase/firestore";
import { create_docID } from "../firebase_utils/fetchData";
import db from "../firebase";

export const modal_adder = async (table, input_data, route, istoast=true) => {
    const docID = create_docID(table)

    try {
        await setDoc(doc(db, table, docID), input_data);
        console.log(table, "Data Addition Successful");
        localStorage.setItem('done', true)
        window.location.href=route
        
      } catch (error) {
        console.error(table, error);
      }

      if (istoast) {
        const toast_message = `${ table.charAt(0).toUpperCase() + table.slice(1) } added`
        localStorage.setItem('toast', toast_message)
      }
}

export const modal_updater = async (table, input_data, route, document_id, istoast=true) => {
    try {
        const docRef = doc(db, table, document_id); // Reference to the document to update
        await updateDoc(docRef, input_data);
        console.log(table, "Data Update Successful");
    } catch (e) {
        console.log(table, e);
    }

    if (istoast){
        const toast_message = `${ table.charAt(0).toUpperCase() + table.slice(1) } updated`
        localStorage.setItem('toast', toast_message)
    }

    if (route === 'none'){
        return
    }else{
        window.location.href=route
    }
}

export const only_add = async (table, input_data) => {
    try {
        const docRef = doc(db, table); // Reference to the document to update
        await setDoc(docRef, input_data);
        console.log(table, "Data Add Successful");
    } catch (e) {
        console.log(table, e);
    }
}

export const only_update = async (table, input_data, document_id) => {
    try {
        const docRef = doc(db, table, document_id); // Reference to the document to update
        await updateDoc(docRef, input_data);
        console.log(table, "Data Update Successful");
    } catch (e) {
        console.log(table, e);
    }
}