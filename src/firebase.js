import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDWEe2275VUL1C1o9HtW6fVrAFj6B-qegk",
  authDomain: "reactapp-c3c8f.firebaseapp.com",
  projectId: "reactapp-c3c8f",
  storageBucket: "reactapp-c3c8f.appspot.com", // ✅ Corrected
  messagingSenderId: "893071149843",
  appId: "1:893071149843:web:c498fee0fec3487b88a8e6"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
