import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";


const firebaseConfig = {
  apiKey: "AIzaSyDq56uYIKjx1CDEYji0le5qA0ImoiZ5zC4",
  authDomain: "sparta-45299.firebaseapp.com",
  projectId: "sparta-45299",
  storageBucket: "sparta-45299.appspot.com",
  messagingSenderId: "558307528400",
  appId: "1:558307528400:web:79cc67759376bd1f4ad8d5"
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


export { db };
