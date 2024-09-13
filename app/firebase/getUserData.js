import {getDoc, doc } from "firebase/firestore";
import { db } from './firebaseConfig.ts'
import { saveUserData } from "./saveUserData.js";
//tgid

export default async function getUserData(user) {
  const uid = user.uid
  const username = user.username

  try {
      const userRef = doc(db, "users", String(uid)); 
      // link to db 
      const userSnapshot = await getDoc(userRef);
      if (userSnapshot.exists()) {
        // Если документ существует, получаем данные
        const userData = userSnapshot.data();
        console.log("Данные пользователя:", userData);
        return userData; // Возвращаем данные, если нужно использовать их далее
      } else {
        console.log("Пользователь с таким uid не найден.");
        saveUserData(uid,username)
        console.log('creating new user')
        return {
          username: username,
          uid: uid,
          clicks: 0
        }; // Пользователь не найден
      }
      
    } catch (error) {
      console.error("Ошибка при сохранении пользователя: ", error);
    }
  }
  