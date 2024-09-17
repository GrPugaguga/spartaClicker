'use client';

import { useEffect, useState, useCallback } from 'react';
import Market from './components/market.jsx';
import ItemData from './components/itemData.jsx';
import BuyButton from './components/buyButton.jsx'; // Import the new BuyButton

export default function Treasure() {
  const [userData, setUserData] = useState({});
  const [item, setItem] = useState(null);
  const [market, setMarket] = useState({});
  const [buySuccess, setBuySuccess] = useState(false); // Добавляем состояние для сообщения

  useEffect(() => {
    getUserData();
    getMarket();
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

  const getMarket = useCallback(async () => {
    const WebApp = (await import('@twa-dev/sdk')).default;
    WebApp.ready();
    const initData = WebApp.initData;

    if (initData) {
      try {
        const res = await fetch('/api/market');

        if (!res.ok) throw new Error(`Ошибка: ${res.status}`);

        const data = await res.json();
        if (data.market) {
          setMarket(data.market);
        } else {
          console.log('Рынок не найден');
        }
      } catch (error) {
        console.error('Error during fetching market:', error);
      }
    }
  }, []);

  const buyItem = async () => {
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
      setUserData((prev) => ({
        ...prev,
        clicks: prev.clicks - item.price,
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
    if (item && item.price <= userData.clicks && item.lvlBosses <= userData.lvlBosses) {
      buyItem();
      console.log('Item purchased:', item.name);
    } else {
      console.log('Недостаточно кликов или уровня для покупки.');
    }
  };

  return (
    <main className="flex flex-col items-center min-h-screen bg-gradient-to-b from-black to-gray-900 text-white py-12">
      <span className="absolute top-4 left-4 text-lg">
        Gold: <span className="text-yellow-400">{userData.clicks || 0}</span>
      </span>
      <span className="absolute top-4 ml-4 text-lg">
        Lvl: <span className="text-yellow-400">{userData.lvlBosses || 0}</span>
      </span>
      <div className="flex flex-col items-center bg-gray-800 border border-gray-700 rounded-lg p-6 w-full max-w-md">
        <ItemData item={item} setItem={setItem} />
      </div>
      <hr className="my-8 border-gray-600 border-t-2" />
      <BuyButton item={item} userData={userData} handleBuy={handleBuy} setUserData={setUserData} />
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
