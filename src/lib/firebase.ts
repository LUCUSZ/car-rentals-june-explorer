
import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

// Your web app's Firebase configuration
// Using a demo configuration that allows testing without actual Firebase backend
const firebaseConfig = {
  apiKey: "AIzaSyBXDgaGk-ghXsUBQ0XgH9-CXWJAk0TA5cI",
  authDomain: "demo-car-rental-app.firebaseapp.com",
  projectId: "demo-car-rental-app",
  storageBucket: "demo-car-rental-app.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:1234567890abcdef123456"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Use local emulators in development if needed
// if (import.meta.env.DEV) {
//   connectAuthEmulator(auth, "http://localhost:9099");
//   connectFirestoreEmulator(db, "localhost", 8080);
// }

export default app;
