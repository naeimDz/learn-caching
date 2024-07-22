import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBhPozyr6K0nmDsANs7yyZvR422yMs44FA",
    authDomain: "myportfolio-a9d75.firebaseapp.com",
    projectId: "myportfolio-a9d75",
    storageBucket: "myportfolio-a9d75.appspot.com",
    messagingSenderId: "12705489519",
    appId: "1:12705489519:web:3f3bac6d140ffd1902239a"
  };

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);