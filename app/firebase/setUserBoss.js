import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from './firebaseConfig.ts';

export async function setUserBoss(uid) {
    console.log(uid)
    const userRef = doc(db, "users", String(uid));
    try {
      // Увеличиваем количество кликов на 1
      await updateDoc(userRef, {
        lvlBosses: increment(1)
      });
    return true
    } catch (error) {
      console.error("Ошибка при обновлении: ", error);
      return false
    }
  }