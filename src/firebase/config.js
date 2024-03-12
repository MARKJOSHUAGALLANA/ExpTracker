import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDKKexKwyfSbz0xlttrJDbwp8Ql65W1HH0",

  authDomain: "expense-tracker-1af75.firebaseapp.com",

  projectId: "expense-tracker-1af75",

  storageBucket: "expense-tracker-1af75.appspot.com",

  messagingSenderId: "431057098980",

  appId: "1:431057098980:web:e03cbba3b7d1fb23b474f1"

  };
  



initializeApp(firebaseConfig);

const db = getFirestore();
export default db