import { setDoc, doc, getDoc } from "firebase/firestore";
import { db } from './firebaseConfig';

export async function saveUserData(uid: string | number, username: string) {
  try {
    const userRef = doc(db, "users", String(uid));
    const userSnapshot = await getDoc(userRef);

    if (userSnapshot.exists()) {
      console.log("User already registered");
      return;
    } else {
      await setDoc(userRef, {
        username: username,
        uid: uid,
        clicks: 0,
        lvlBosses: 1,
        damage: 1,
        weapon: 'none',
        backPack: [],
      });
    }
  } catch (error) {
    console.error("Error saving user data: ", error);
    throw error;
  }
}
