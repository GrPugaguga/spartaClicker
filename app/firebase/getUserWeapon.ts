import { getDoc, doc, updateDoc } from "firebase/firestore";
import { db } from './firebaseConfig';

interface WeaponData {
  damage: number | string;
}

export async function getUserWeapon({ uid, weapon }: { uid: string | number; weapon: string }) {
  try {
    const weaponRef = doc(db, "weapon", weapon);
    const weaponSnapshot = await getDoc(weaponRef);
    const weaponData = weaponSnapshot.data() as WeaponData;

    const userRef = doc(db, "users", String(uid));
    await updateDoc(userRef, {
      damage: weaponData.damage,
      weapon: weapon,
    });

    return true;
  } catch (error) {
    console.error("Error updating user weapon: ", error);
    return false;
  }
}
