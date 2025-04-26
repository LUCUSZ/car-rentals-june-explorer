
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDdaNVP-EaLPrx5ioVx4fBYwGGN3_ZF5G0",
  authDomain: "car-rental-june-explorer.firebaseapp.com",
  projectId: "car-rental-june-explorer",
  storageBucket: "car-rental-june-explorer.appspot.com",
  messagingSenderId: "482734394048",
  appId: "1:482734394048:web:46efc9212824b71f2582d2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
