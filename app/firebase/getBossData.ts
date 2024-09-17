import { getDoc, doc } from "firebase/firestore";
import { db } from './firebaseConfig';

interface BossData {
  hp: number;
  regen: number;
}

export default async function getBossData({ lvl }: { lvl: number  }): Promise<BossData> {
  try {
    const bossRef = doc(db, "bosses", String(lvl));
    const bossSnapshot = await getDoc(bossRef);

    if (bossSnapshot.exists()) {
      const bossData = bossSnapshot.data() as BossData;
      return bossData;
    } else {
      return {
        hp: lvl * lvl * 10,
        regen: lvl * lvl + 7,
      };
    }
  } catch (error) {
    console.error("Error fetching boss data", error);
    throw error;
  }
}
