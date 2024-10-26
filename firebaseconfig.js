import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';




const firebaseConfig = {
  apiKey: "AIzaSyBMgfd8eZAL7N0VsQkBeXfSEIUU5_Kp1so",
  authDomain: "dietmate-711c4.firebaseapp.com",
  projectId: "dietmate-711c4",
  storageBucket: "dietmate-711c4.appspot.com",
  messagingSenderId: "982741386287",
  appId: "1:982741386287:android:883431b36f1252dff0f2da",
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;
