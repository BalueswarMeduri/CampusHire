// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  GoogleAuthProvider,
  signOut
} from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // ✅ fixed import

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA43kE4eLYN-fABW-S0dzF0kZ9G0n0F5kM",
  authDomain: "campushire-ee451.firebaseapp.com",
  projectId: "campushire-ee451",
  storageBucket: "campushire-ee451.appspot.com", // ✅ corrected domain
  messagingSenderId: "662213154532",
  appId: "1:662213154532:web:c38964aba4161436b6bef1",
  measurementId: "G-HGQMN9JWZE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app); // Optional: Only if used

// Exports
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
export { signOut };
