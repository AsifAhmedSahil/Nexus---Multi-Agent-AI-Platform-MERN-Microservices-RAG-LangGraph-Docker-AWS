// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "nexus-ai-7ee0f.firebaseapp.com",
  projectId: "nexus-ai-7ee0f",
  storageBucket: "nexus-ai-7ee0f.firebasestorage.app",
  messagingSenderId: "1046800162668",
  appId: "1:1046800162668:web:4b0484d3865389214c5d49"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()

