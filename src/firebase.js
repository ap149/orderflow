// src/firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDUDow6zlpf_HkdlYIL3dqGnvOwU372HyQ",
  authDomain: "order-flow-80656.firebaseapp.com",
  databaseURL: "https://order-flow-80656-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "order-flow-80656",
  storageBucket: "order-flow-80656.firebasestorage.app",
  messagingSenderId: "821503055013",
  appId: "1:821503055013:web:b2d3df9c73d3e29764694c",
  measurementId: "G-18YL78P2YZ"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
