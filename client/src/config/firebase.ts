// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAPPlDwW9roR96z9V0gA5E6LztVqhxjaus",
  authDomain: "jalankami-decac.firebaseapp.com",
  projectId: "jalankami-decac",
  storageBucket: "jalankami-decac.appspot.com",
  messagingSenderId: "443162624177",
  appId: "1:443162624177:web:db283b930c71326611e290"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);