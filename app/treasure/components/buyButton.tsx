'use client';

import { UserData, ItemData as ItemType } from './../../types';

interface BuyButtonProps {
  item: ItemType | null;
  userData: UserData | null;
  handleBuy: () => void;
}

export default function BuyButton({ item, userData, handleBuy }: BuyButtonProps) {
  if (!userData) return null;
  const canBuy = item && Number(item.price) <= userData.clicks && Number(item.lvlBosses) <= userData.lvlBosses;

  return (
    <button
      className={`
        ${canBuy ? 'bg-roman-gold hover:bg-roman-red' : 'bg-roman-wood cursor-not-allowed'}
        text-roman-black font-bold py-2 px-4 rounded-lg
        border-2 ${canBuy ? 'border-roman-red' : 'border-roman-gold'}
        transition-all duration-300 transform hover:scale-105
        shadow-lg hover:shadow-xl
      `}
      onClick={canBuy ? handleBuy : undefined}
      disabled={!canBuy}
    >
      {canBuy ? `Buy ${item?.name}` : `Cannot Buy ${item?.name || 'Item'}`}
    </button>
  );
}