import { doc, updateDoc ,getDoc} from "firebase/firestore";
import { db } from './firebaseConfig.ts';

export async function getUserWeapon({uid,weapon}) {
    console.log(uid)
    console.log(`Получение данных  для уровня: ${weapon}`);

    const useWeaponRef = doc(db, "weapon", String(weapon))
    console.log(`Ссылка на документ: ${useWeaponRef.path}`);
    const weaponSnapshot = await getDoc(useWeaponRef);
            // Если документ существует, получаем данные
    const weaponData = weaponSnapshot.data();
    const userRef = doc(db, "users", String(uid));
    try {
      // Увеличиваем количество кликов на 1
      await updateDoc(userRef, {
        damage: weaponData.damage,
        weapon: String(weapon)
      });
    return true
    } catch (error) {
      console.error("Ошибка при обновлении: ", error);
      return false
    }
  }