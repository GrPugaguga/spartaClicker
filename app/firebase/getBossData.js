import {getDoc, doc } from "firebase/firestore";
import { db } from './firebaseConfig.ts'
//

export default async function getBossData({lvl}) {


  try {
      const bossRef = doc(db, "bosses", String(lvl)); 
      // link to db 
      const bossSnapshot = await getDoc(bossRef);
      if (bossSnapshot.exists()) {
        // Если документ существует, получаем данные
        const bossrData = bossSnapshot.data();
        console.log("New Boss", bossrData);
        return bossrData; // Возвращаем данные, если нужно использовать их далее
      } else {
        return {
          hp: lvl*100,
          regen: lvl*3
        }; // Пользователь не найден
      }
      
    } catch (error) {
      console.error("get boss error", error);
    }
  }
  