// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBZLArrWlZxP8DgxgRrr2kHs3OhQ0rSaj4",
  authDomain: "eterna-123.firebaseapp.com",
  projectId: "eterna-123",
  storageBucket: "eterna-123.firebasestorage.app",
  messagingSenderId: "106974360179",
  appId: "1:106974360179:web:460599317ff9c2b36eb006",
  measurementId: "G-2SWYV26FGP"
};

const app = initializeApp(firebaseConfig);

// ✅ Services
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };
