import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  where,
  limit,
  getDocs,
  Timestamp,
  serverTimestamp,
  increment
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  //firebase config goes here (removed cuz of obvious reasons)
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();
export const firestore = getFirestore(app);
export const storage = getStorage(app);
export const fromMillis = Timestamp.fromMillis;
export const ServerTimestamp = serverTimestamp
export const fieldIncrement = increment;

///helper functions
/**
 * Gets a users/{uid} document with username
 * @param {string} username
 */
export async function getUserWithUsername(username) {
  const usersRef = collection(firestore, "users");
  const q = query(usersRef, where("username", "==", username), limit(1));
  const userDoc = getDocs(q);
  return (await userDoc).docs[0];
}

/**
 * Converts a firestore document to JSON
 * @param doc
 */
export function postToJSON(docSnap) {
  const data = docSnap.data();
  return {
    ...data,
    createdAt: data.createdAt.toMillis(),
    updatedAt: data.updatedAt.toMillis(),
  };
}