import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"
const firebaseConfig = {
    apiKey: "AIzaSyCJrKHO904R6VxWetixv8DE_9OmqbGZ79k",
    authDomain: "fir-c29ea.firebaseapp.com",
    projectId: "fir-c29ea",
    storageBucket: "fir-c29ea.appspot.com",
    messagingSenderId: "407634550771",
    appId: "1:407634550771:web:9ad1fb08dcd8bdc572bc86"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth()
export const provider = new GoogleAuthProvider();

export default app;