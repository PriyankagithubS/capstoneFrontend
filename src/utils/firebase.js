// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY,
    authDomain: "projectmangementool.firebaseapp.com",
    projectId: "projectmangementool",
    storageBucket: "projectmangementool.appspot.com",
    messagingSenderId: "583744393743",
    appId: "1:583744393743:web:850ad9d3f07b76577e897a"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);