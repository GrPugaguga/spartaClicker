import { collection, getDocs } from "firebase/firestore";
import { db } from './firebaseConfig';

interface Item {
  name: string;
  price: number | string;
  damage: number | string;
}

export async function getMarket(): Promise<Item[]> {
  try {
    const marketRef = collection(db, "weapon");
    const marketSnapshot = await getDocs(marketRef);
    const marketData = marketSnapshot.docs.map((doc) => doc.data() as Item);
    return marketData;
  } catch (error) {
    console.error("Error fetching market data: ", error);
    throw error;
  }
}
