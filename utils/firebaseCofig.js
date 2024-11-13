// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyBAuBXk_hcObsnGgBUGmP0FJgPnt-zsRqo",
  authDomain: "infinity-eec09.firebaseapp.com",
  projectId: "infinity-eec09",
  storageBucket: "infinity-eec09.firebasestorage.app",
  messagingSenderId: "177255109702",
  appId: "1:177255109702:web:49ad52e9fc701291ebe647"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
