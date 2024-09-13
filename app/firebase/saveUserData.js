import {setDoc, doc,getDoc } from "firebase/firestore";
import { db } from './firebaseConfig.ts'

export  async function saveUserData(uid, username) {
    try {
      const userRef = doc(db, "users", String(uid)); 
      const userSnapshot = await getDoc(userRef);
      if (userSnapshot.exists()) {
        console.log("User already registered ");
      } else {
          await setDoc(userRef, {
          username: username,
          uid: uid,
          clicks: 0
        }
      );
        console.log("Пользователь создан.");
      }
    } catch (error) {
      console.error("Ошибка при сохранении пользователя: ", error);
    }
  }
  