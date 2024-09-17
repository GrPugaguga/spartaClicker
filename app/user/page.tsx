'use client';

import { useEffect, useState, useCallback } from 'react';
import UserData from './components/userData';
import BackPack from './components/backPack';
import getItemDamage from './components/getItemDamage'

export default function User() {
  const [userData, setUserData] = useState({});
  const [activeWeapon, setActiveWeapon] = useState('')

  useEffect(() => {  
 getUserData();
  }, []);

  // useEffect(() => {
  //   if(activeWeapon == userData.weapon) return
  //   setActiveWeapon(userData.weapon)
  // },[userData])

  useEffect(() => {
    const fetchUserWeapon = async () => {
        try {
          const response = await fetch('/api/changeWeapon', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              uid: userData.uid,
              username: userData.username,
              weapon: activeWeapon
            }),
          });
  
          if (!response.ok) throw new Error(`Error: ${response.status}`);



          } catch (error) {
          console.error("Failed to fetch boss data:", error);
        }
      };
      setUserData((prev) => ({
        ...prev,
        weapon: activeWeapon,
        damage: getItemDamage(activeWeapon)
      }))
      if(userData){
        fetchUserWeapon()
      }

  },[activeWeapon])


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
          setActiveWeapon(data.user.weapon)
        } else {
          console.log('Пользователь не найден');
        }
      } catch (error) {
        console.error('Error during authentication:', error);
      }
    }
  }, []);

  return (
    <main className="flex flex-col items-center  min-h-screen bg-gradient-to-b from-black to-gray-900 text-white py-12 ">
      <div className="flex flex-col items-center bg-gray-800 border border-gray-700 rounded-lg p-6 w-full max-w-md">
        <UserData userData={userData} activeWeapon={activeWeapon} setActiveWeapon={setActiveWeapon}/>
      </div>
      <hr className="my-8 border-gray-600 border-t-2" />
      <div className="mt-8 w-full max-w-md">
        <BackPack userData={userData} setActiveWeapon={setActiveWeapon}/>
      </div>
    </main>
  );
}
