// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCYyzh8pybqc3L57MwwO2HgqLs2d6DQotU",
  authDomain: "jlttransport-5d394.firebaseapp.com",
  projectId: "jlttransport-5d394",
  storageBucket: "jlttransport-5d394.firebasestorage.app",
  messagingSenderId: "314531779574",
  appId: "1:314531779574:web:e086c31e7c90626d8cedd7",
  measurementId: "G-PPP5XV9XPR",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
