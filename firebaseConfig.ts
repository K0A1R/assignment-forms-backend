import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB-lv5scsXnCugY3b5EPRe37yC1huWqTG8",
  authDomain: "assignment-forms-backend.firebaseapp.com",
  projectId: "assignment-forms-backend",
  storageBucket: "assignment-forms-backend.firebasestorage.app",
  messagingSenderId: "789714976704",
  appId: "1:789714976704:web:7d0f6b5175e245dd1a5225",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
