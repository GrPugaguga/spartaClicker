import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from './firebaseConfig';

export async function setUserClick(uid: string | number, clicks: number ) {
  const userRef = doc(db, "users", String(uid));
  try {
    await updateDoc(userRef, {
      clicks: increment(clicks),
    });
    return true;
  } catch (error) {
    console.error("Error updating user clicks: ", error);
    return false;
  }
}
