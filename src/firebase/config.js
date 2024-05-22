import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC-af8X9BYOpRp7wgqeQJvrBirKA35KnG0",
  authDomain: "projeto1-react.firebaseapp.com",
  projectId: "projeto1-react",
  storageBucket: "projeto1-react.appspot.com",
  messagingSenderId: "1040568532605",
  appId: "1:1040568532605:web:a1b7370a757f521bb3fb14"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db };