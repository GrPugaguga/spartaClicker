import { getDoc, doc } from "firebase/firestore";
import { db } from './firebaseConfig';
import { saveUserData } from "./saveUserData";

interface User {
  uid: string | number;
  username: string;
}

export default async function getUserData(user: User) {
  const { uid, username } = user;

  try {
    const userRef = doc(db, "users", String(uid));
    const userSnapshot = await getDoc(userRef);

    if (userSnapshot.exists()) {
      const userData = userSnapshot.data();
      return userData;
    } else {
      console.log('Creating new user');
      await saveUserData(uid, username);
      return {
        username: username,
        uid: uid,
        clicks: 0,
        lvlBosses: 1,
        damage: 1,
        weapon: 'none',
        backPack: [],
        energy: 1000,
        timestamp: Date.now()
      };
    }
  } catch (error) {
    console.error("Error fetching user data: ", error);
    throw error;
  }
}
