// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCAcesLW-nu96NUqBfWBRMeigurbeEgj68",
    authDomain: "ocuai-7d1ca.firebaseapp.com",
    projectId: "ocuai-7d1ca",
    storageBucket: "ocuai-7d1ca.firebasestorage.app",
    messagingSenderId: "809042679791",
    appId: "1:809042679791:web:cf5c63693832ad8215481a",
    measurementId: "G-19NFZJ3D7J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export { db };
