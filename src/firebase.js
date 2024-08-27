// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAilWz_CHuKzDLsDuWYVrlFTD7RMp_zb0Q",
  authDomain: "sunyata-hrms-fcdfd.firebaseapp.com",
  projectId: "sunyata-hrms-fcdfd",
  storageBucket: "sunyata-hrms-fcdfd.appspot.com",
  messagingSenderId: "13757112845",
  appId: "1:13757112845:web:f1add6d74fe97ec0f1ab44",
  measurementId: "G-VG0C8NQSFZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)
const db = getFirestore(app)

export default db