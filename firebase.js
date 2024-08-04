import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDdkQaCXv11X7JSZMgV4l_s1c0WSBvWPfU",
  authDomain: "inventory-management-app-78c7b.firebaseapp.com",
  projectId: "inventory-management-app-78c7b",
  storageBucket: "inventory-management-app-78c7b.appspot.com",
  messagingSenderId: "202336226526",
  appId: "1:202336226526:web:90fe42c75e1d2abae4c64f",
  measurementId: "G-1L8RDM5400"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { app, firestore, auth, provider };