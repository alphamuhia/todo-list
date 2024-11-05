import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCjAIzwYCdhGRa4Q8kPcqGZI0itlN8ap60",
  authDomain: "peter-s-work.firebaseapp.com",
  projectId: "peter-s-work",
  storageBucket: "peter-s-work.firebasestorage.app",
  messagingSenderId: "830902486512",
  appId: "1:830902486512:web:828154630e4c2f41fec935",
  measurementId: "G-VCD39V2CV4",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
