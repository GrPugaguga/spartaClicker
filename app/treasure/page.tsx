'use client';

import { useEffect, useState, useCallback } from 'react';
import Market from './components/market';
import ItemData from './components/itemData';
import BuyButton from './components/buyButton'; // Import the new BuyButton
import { UserData, ItemData as ItemType } from './../types';
import { useUser } from '../context/UserContext';
import LoadingSpinner from '../components/LoadingSpinner';


export default function Treasure() {
  const { userData, setUserData, isLoading, market } = useUser();
  const [item, setItem] = useState<ItemType | null>(null);
  const [buySuccess, setBuySuccess] = useState(false); // Add state for success message

  useEffect(() => {
    getUserData();
  }, []);


  const getUserData = useCallback(async () => {
    const WebApp = (await import('@twa-dev/sdk')).default;
    WebApp.ready();
    const initData = WebApp.initData;

    if (initData) {
      try {
        const res = await fetch('/api/user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ initData }),
        });

        if (!res.ok) throw new Error(`Ошибка: ${res.status}`);

        const data = await res.json();
        if (data.user) {
          setUserData(data.user);
        } else {
          console.log('Пользователь не найден');
        }
      } catch (error) {
        console.error('Error during authentication:', error);
      }
    }
  }, []);


  const buyItem = async () => {
    if (!item || !userData) {
      console.log('Item or userData is null');
      return;
    }
    try {
      const response = await fetch('/api/buyItem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: userData.uid,
          itemPrice: item.price,
          itemName: item.name
        }),
      });

      if (!response.ok) throw new Error(`Error: ${response.status}`);

      // Обновляем состояние userData, добавляя предмет в рюкзак
      setUserData((prev:any) => ({
        ...prev,
        clicks: prev.clicks - Number(item.price),
        backpack: Array.isArray(prev.backpack) ? [...prev.backpack, item.name] : [item.name]
      }));

      setBuySuccess(true); // Устанавливаем сообщение о том, что покупка успешна
      setTimeout(() => setBuySuccess(false), 3000); // Скрыть сообщение через 3 секунды

    } catch (error) {
      console.error("Failed to buy item:", error);
    }
  };

  const handleBuy = () => {
    // Логика покупки предмета
    if (!item || !userData) {
      console.log('Item or userData is null');
      return;
    }
    if (item && Number(item.price) <= userData.clicks && Number(item.lvlBosses) <= userData.lvlBosses) {
      buyItem();
      console.log('Item purchased:', item.name);
    } else {
      console.log('Недостаточно кликов или уровня для покупки.');
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <main className="flex flex-col items-center min-h-screen bg-gradient-to-b from-black to-gray-900 text-white py-12 ">
      <span className="absolute top-4 left-4 text-lg">
        Gold: <span className="text-yellow-400">{userData?.clicks || 0}</span>
      </span>
      <span className="absolute top-4 ml-4 text-lg">
        Lvl: <span className="text-yellow-400">{userData?.lvlBosses || 0}</span>
      </span>
      <div className="flex flex-col items-center bg-gray-800 border border-gray-700 rounded-lg p-6 w-full max-w-mdborder-2 border-solid border-yellow-500">
        <ItemData item={item} setItem={setItem} />
      </div>
      <hr className="my-8 border-gray-600 border-t-2 " />
      <BuyButton item={item} userData={userData} handleBuy={handleBuy} />
      <div className="mt-8 w-full max-w-md">
        <Market market={market} setItem={setItem} />
      </div>

      {/* Сообщение об успешной покупке с серым цветом и на верхнем слое */}
      {buySuccess && (
        <div 
          className="fixed top-0 left-0 right-0 bg-gray-700 text-white p-4 text-center z-50"
          style={{ zIndex: 100 }}
        >
          Покупка успешно завершена!
        </div>
      )}
    </main>
  );
}
