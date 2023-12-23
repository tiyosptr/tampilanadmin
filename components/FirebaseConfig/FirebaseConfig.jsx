import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


function FirebaseConfig() {
  const firebaseConfig = {
  apiKey: "AIzaSyCotdyaZIz1nHXgLqPWSIX8lt2erKeR8Xc",
  authDomain: "mollery-63499.firebaseapp.com",
  databaseURL: "https://mollery-63499-default-rtdb.firebaseio.com",
  projectId: "mollery-63499",
  storageBucket: "mollery-63499.appspot.com",
  messagingSenderId: "949939380299",
  appId: "1:949939380299:web:09274ad31ff7e91c3d2dce",
  measurementId: "G-L5880BNR05"
  };

  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);
  const storage = getStorage(app);
  const auth = getAuth(app);
  const firestore = getFirestore(app);

  return {
    database: db,
    storage: storage,
    auth: auth,
    firestore: firestore,
  };
}

export default FirebaseConfig;
