// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const saveProgress = async (uid, section, score) => {
  await setDoc(doc(db, "progress", uid), { [section]: score }, { merge: true });
};

export const getProgress = async (uid) => {
  const docRef = doc(db, "progress", uid);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : {};
};

export const addToVocabulary = async (uid, word, definition) => {
  await setDoc(
    doc(db, "vocabulary", `${uid}_${word}`),
    { word, definition, timestamp: new Date().toISOString() },
    { merge: true }
  );
};

export { collection, query, where, getDocs };
