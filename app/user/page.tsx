'use client';

import { useEffect, useState, useCallback } from 'react';
import UserData from './components/userData';
import BackPack from './components/backPack';
import getItemDamage from './components/getItemDamage';
import { UserData as UserDataType } from './../types'; // Import the UserData type
import { useUser } from '../context/UserContext';
import LoadingSpinner from '../components/LoadingSpinner';

export default function User() {
  // Define the type of userData using the UserData interface
  const { userData, setUserData, isLoading } = useUser();
  const [activeWeapon, setActiveWeapon] = useState<string>(userData? userData?.weapon : '');

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    const fetchUserWeapon = async () => {
      try {
        const response = await fetch('/api/changeWeapon', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uid: userData?.uid, // Optional chaining to avoid null/undefined issues
            weapon: activeWeapon,
          }),
        });

        if (!response.ok) throw new Error(`Error: ${response.status}`);
      } catch (error) {
        console.error('Failed to fetch boss data:', error);
      }
    };

    if (userData) {
      setUserData((prev: any) =>
        prev
          ? {
              ...prev,
              weapon: activeWeapon,
              damage: getItemDamage(activeWeapon) ,
            }
          : prev
      );
      fetchUserWeapon();
    }
  }, [activeWeapon]);

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
          setActiveWeapon(data.user.weapon);
        } else {
          console.log('Пользователь не найден');
        }
      } catch (error) {
        console.error('Error during authentication:', error);
      }
    }
  }, []);

  if (isLoading) return <LoadingSpinner />;

  return (
    <main className="flex flex-col items-center min-h-screen bg-roman-black text-roman-gold py-12">
      <div className="flex flex-col items-center bg-roman-wood border-2 border-roman-gold rounded-lg p-6 w-full max-w-md">
        {userData && (
          <UserData userData={userData} activeWeapon={activeWeapon} setActiveWeapon={setActiveWeapon} />
        )}
      </div>
      <hr className="my-8 border-roman-gold border-t-2 w-full max-w-md" />
      <div className="mt-8 w-full max-w-md">
        {userData && <BackPack userData={userData} setActiveWeapon={setActiveWeapon} />}
      </div>
    </main>
  );
}
