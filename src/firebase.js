//no-no touch this, okehh?? this is for the logic of firebase

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase config (from Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyDEtJaeA7JZAG_6UUxzgGoDn248M1BHraU",
  authDomain: "healthcare-56817.firebaseapp.com",
  projectId: "healthcare-56817",
  storageBucket: "healthcare-56817.firebasestorage.app",
  messagingSenderId: "127632458849",
  appId: "1:127632458849:web:45a0cbc868e4523ac35620",
  measurementId: "G-N147CKQY1Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the services we need
export const auth = getAuth(app);
export const db = getFirestore(app);
