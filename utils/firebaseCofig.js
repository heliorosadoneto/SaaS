// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyCEV7ijk-jU90nONAagHm6tL1550cUVGcQ",
  authDomain: "saas-c5671.firebaseapp.com",
  databaseURL: "https://saas-c5671-default-rtdb.firebaseio.com",
  projectId: "saas-c5671",
  storageBucket: "saas-c5671.appspot.com",
  messagingSenderId: "638733461476",
  appId: "1:638733461476:web:34bc25cf7984b8429649f1",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
