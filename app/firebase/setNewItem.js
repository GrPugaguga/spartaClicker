import { doc, updateDoc, arrayUnion, increment } from "firebase/firestore";
import { db } from './firebaseConfig.ts';

export async function setNewItem(uid, itemName, itemPrice) {
    const userRef = doc(db, "users", String(uid));
    try {
        // Уменьшаем количество кликов на itemPrice и добавляем itemName в массив backpack
        await updateDoc(userRef, {
            clicks: increment(-itemPrice), // уменьшаем количество кликов
            backPack: arrayUnion(itemName) // добавляем itemName в массив backpack
        });
        return true;
    } catch (error) {
        console.error("Ошибка при обновлении", error);
        return false;
    }
}