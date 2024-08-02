// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA4qwWOlbshh0I5d-5ggY7VC82KR7Uz7fY",
  authDomain: "pantry-42134.firebaseapp.com",
  projectId: "pantry-42134",
  storageBucket: "pantry-42134.appspot.com",
  messagingSenderId: "759483756883",
  appId: "1:759483756883:web:a81d064f5b94611e6671a6",
  measurementId: "G-RG7GHNM3JV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)
export{app, firestore}