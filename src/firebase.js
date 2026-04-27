import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDwGaBKIzeCQ2IIT27X7NYBMo0-tPSqG_I",
  authDomain: "project-ithealth-group7.firebaseapp.com",
  projectId: "project-ithealth-group7",
  storageBucket: "project-ithealth-group7.firebasestorage.app",
  messagingSenderId: "783036964548",
  appId: "1:783036964548:web:53faf1cbd912f4662db391"
};

const app = initializeApp(firebaseConfig);

// Initialize and export Auth and Firestore so other files can use them
export const auth = getAuth(app);
export const db = getFirestore(app);