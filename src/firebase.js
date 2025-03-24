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
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || undefined,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const saveProgress = async (uid, section, score) => {
  if (!uid) return;
  try {
    await setDoc(
      doc(db, "progress", uid),
      { [section]: score },
      { merge: true }
    );
  } catch (error) {
    console.error("Xatolik: Progressni saqlashda muammo!", error);
  }
};

export const getProgress = async (uid) => {
  if (!uid) return {};
  try {
    const docRef = doc(db, "progress", uid);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : {};
  } catch (error) {
    console.error("Xatolik: Progressni olishda muammo!", error);
    return {};
  }
};

export const addToVocabulary = async (uid, word, definition) => {
  if (!uid || !word || !definition) return;
  try {
    await setDoc(
      doc(db, "vocabulary", `${uid}_${word}`),
      { word, definition, timestamp: new Date().toISOString() },
      { merge: true }
    );
  } catch (error) {
    console.error("Xatolik: Lug‘atga so‘z qo‘shishda muammo!", error);
  }
};

export { collection, query, where, getDocs };
