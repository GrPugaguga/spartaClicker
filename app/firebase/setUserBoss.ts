import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from './firebaseConfig';

export async function setUserBoss(uid: string | number) {
  const userRef = doc(db, "users", String(uid));
  try {
    await updateDoc(userRef, {
      lvlBosses: increment(1),
    });
    return true;
  } catch (error) {
    console.error("Error updating user boss level: ", error);
    return false;
  }
}
