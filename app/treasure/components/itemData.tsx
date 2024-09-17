'use client';

import { ItemData as ItemType } from './../../types';

interface ItemDataProps {
  item: ItemType | null;
  setItem: (item: ItemType | null) => void;
}

export default function ItemData({ item, setItem }: ItemDataProps) {
  return (
    <div className="flex flex-col items-center p-4 bg-gray-700 border border-gray-600 rounded-md" onDoubleClick={() => setItem(null)}>
      <div className="cell bg-gray-600 border border-gray-500 rounded-lg h-24 w-24 flex justify-center items-center">
        {item ? (
          <img src={`/images/weapon/${item.name}.jpg`} alt="" className="object-contain w-full h-full" />
        ) : null}
      </div>
      <div className="text-xl font-bold text-yellow-300 mb-4"></div>
      <div className="flex flex-col gap-2 text-left">
        <span className="text-lg">
          Price: <span className="text-yellow-400">{item ? item.price : 0}</span>
        </span>
        <span className="text-lg">
          Lvl for item: <span className="text-yellow-400">{item ? item.lvlBosses : 0}</span>
        </span>
        <span className="text-lg">
          Damage: <span className="text-yellow-400">{item ? item.damage : 0}</span>
        </span>
      </div>
    </div>
  );
}
