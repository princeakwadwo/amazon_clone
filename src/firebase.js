import firebase from "firebase";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDm04b17Zl9Xc1xZozKC0DiKc-ahwiOqpQ",
  authDomain: "clone-1312b.firebaseapp.com",
  projectId: "clone-1312b",
  storageBucket: "clone-1312b.appspot.com",
  messagingSenderId: "270305044454",
  appId: "1:270305044454:web:6dec328913cfab61991827",
  measurementId: "G-B4QFJKVXG0",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
export { db, auth };
