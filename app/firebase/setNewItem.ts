import { doc, updateDoc, arrayUnion, increment } from "firebase/firestore";
import { db } from './firebaseConfig';

export async function setNewItem(uid: string | number, itemName: string, itemPrice: number | string) {
  const userRef = doc(db, "users", String(uid));
  try {
    await updateDoc(userRef, {
      clicks: increment(-itemPrice), // Reduce clicks
      backPack: arrayUnion(itemName), // Add item to backpack
    });
    return true;
  } catch (error) {
    console.error("Error updating item", error);
    return false;
  }
}
