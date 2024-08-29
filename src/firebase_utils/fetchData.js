import { getDocs, getDoc,  collection} from "firebase/firestore";
import db from "../firebase";
import { getAuth } from "firebase/auth";

export const create_docID = () => {
    const auth_user = getAuth()
    const user = auth_user.currentUser
    const userID = user.uid
    const currTime = new Date().toLocaleTimeString();
    const docID = `${userID}_department_${currTime}`

    return docID
}

export const fetcher = async (table, setData) => {
    try {
        const querySnapshot = await getDocs(collection(db, table))
        const docs = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
        setData(docs)
    } catch (error) {
        console.log(error);
        
    }
}

// export const fetcher_with_id = async (table, setData)  => {
//     const data = fetcher(table, setData)
//     data?.map((item) => {
//         return {
//             value: item.department,
//             label: item.department,
//             ...item
//         }
//     })
// }