'use client';

import { UserData, ItemData as ItemType } from './../../types';

interface BuyButtonProps {
  item: ItemType | null;
  userData: UserData | null;
  handleBuy: () => void;
}

export default function BuyButton({ item, userData, handleBuy }: BuyButtonProps) {
  if (!userData) return
  const canBuy = item && Number(item.price) <= userData.clicks && Number(item.lvlBosses) <= userData.lvlBosses;

  return (
    <button
      className={`${
        canBuy ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-gray-500 cursor-not-allowed'
      } text-white font-bold py-2 px-4 rounded transition-colors duration-300`}
      onClick={canBuy ? handleBuy : undefined} // Button only clickable if conditions are met
      disabled={!canBuy} // Disable the button if conditions are not met
    >
      {canBuy ? `Buy ${item?.name}` : `Cannot Buy ${item?.name || 'Item'}`}
    </button>
  );
}
