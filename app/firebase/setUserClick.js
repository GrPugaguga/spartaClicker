import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from './firebaseConfig.ts';

export async function setUserClick(uid,clicks) {
    console.log(uid)
    const userRef = doc(db, "users", String(uid));
    try {
      // Увеличиваем количество кликов на 1
      await updateDoc(userRef, {
        clicks: increment(clicks)
      });
    return true
    } catch (error) {
      console.error("Ошибка при обновлении количества кликов: ", error);
      return false
    }
  }