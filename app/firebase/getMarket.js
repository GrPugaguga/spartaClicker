import { collection, getDocs } from "firebase/firestore";
import { db } from './firebaseConfig.ts';

export async function getMarket() {
  try {
    const useRef = collection(db, "weapon");
    const marketSnapshot = await getDocs(useRef);
    
    const marketData = marketSnapshot.docs.map(doc => doc.data());
    
    return marketData;
  } catch (error) {
    console.error("Ошибка при получении данных: ", error);
    return false;
  }
}
