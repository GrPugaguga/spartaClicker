'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import { UserData as UserDataType } from '../types';

interface UserContextType {
  userData: UserDataType | null;
  setUserData: React.Dispatch<React.SetStateAction<UserDataType | null>>;
  isLoading: boolean;
  market:any;
  bossHp:{ hp: number; regen: number }
  setBossHp?:  any
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userData, setUserData] = useState<UserDataType | null>(null);
  const [market,setMarket] = useState()
  const [isLoading, setIsLoading] = useState(true);
  const [bossHp, setBossHp] = useState({
    hp: 0,
    regen: 0,
  });

  useEffect(() => {
    const fetchBossData = async (lvl: number | string) => {
      try {
        const response = await fetch('/api/bossData', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            lvl: lvl,
          }),
        });

        if (!response.ok) throw new Error(`Error: ${response.status}`);

        const data = await response.json();

        if (data.bossData.hp) {
          setBossHp({
            hp:data.bossData.hp,
            regen:data.bossData.regen
          });
        }
      } catch (error) {
        console.error("Failed to fetch boss data:", error);
      }
    };

    async function getUserData() {
      setIsLoading(true);
      try {
        const WebApp = (await import('@twa-dev/sdk')).default;
        WebApp.ready();
        const initData = WebApp.initData;

        if (initData) {
          const res = await fetch('/api/user', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ initData }),
          });

          if (!res.ok) throw new Error(`Error: ${res.status}`);

          const data = await res.json();
          if (data.user) {
            setUserData(data.user);
            await fetchBossData(data.user?.lvlBosses)

          } else {
            console.log('User not found');
          }
        }
      } catch (error) {
        console.error('Error during authentication:', error);
      } finally {
        setIsLoading(false);
      }
    }
    const getMarket = async () => {
      setIsLoading(true);
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
        } finally {
          setIsLoading(false);
        }
      
    };
  
    getMarket()
    getUserData();
  }, []);



  return (
    <UserContext.Provider value={{ userData, setUserData, isLoading ,market, bossHp, setBossHp }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}