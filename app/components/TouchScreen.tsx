"use client"; // Component runs on the client side

import { useState, useRef, useEffect,Touch } from "react";
import useTouchTracking from "@/hooks/useTouchTracker";
import { UserData } from "./../types"; // Import the UserData type from types

interface TouchScreenProps {
  setLocalClicks: React.Dispatch<React.SetStateAction<number>>;
  userData: UserData | null;
  setUserData: React.Dispatch<React.SetStateAction<UserData | null>>;
  bossHp: { hp: number; regen: number };
  setBossHp: React.Dispatch<React.SetStateAction<{ hp: number; regen: number }>>;
}

interface BloodDrop {
  id: number;
  damage: number;
  top: number;
  left: number;
  opacity: number;
}

export default function TouchScreen({ setLocalClicks, userData, setUserData, bossHp, setBossHp }: TouchScreenProps) {
  const { handleTouchStart, handleTouchEnd } = useTouchTracking(setLocalClicks);
  const circleRef = useRef<HTMLDivElement | null>(null);
  const [circleRect, setCircleRect] = useState<DOMRect | null>(null);
  const [hp, setHp] = useState<number>(bossHp.hp);
  const [defeated, setDefeated] = useState<boolean>(false);
  const [bloodDrops, setBloodDrops] = useState<BloodDrop[]>([]);

  useEffect(() => {
    if (circleRef.current) {
      setCircleRect(circleRef.current.getBoundingClientRect());
    }
  }, []);

  useEffect(() => {
    const fetchBossData = async () => {
      try {
        const response = await fetch('/api/bossData', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            lvl: userData?.lvlBosses,
          }),
        });

        if (!response.ok) throw new Error(`Error: ${response.status}`);

        const data = await response.json();

        if (data.bossData.hp) {
          setBossHp({
            hp: data.bossData.hp,
            regen: data.bossData.regen
          });
          setHp(data.bossData.hp);
        }
      } catch (error) {
        console.error("Failed to fetch boss data:", error);
      }
    };

    if (userData?.lvlBosses) {
      fetchBossData();
    }
  }, [userData?.lvlBosses]);

  useEffect(() => {
    const interval = setInterval(() => {
      setHp((prevHp) => {
        if (prevHp === 0 || defeated || !bossHp.regen) {
          return prevHp;
        }
        if (prevHp < bossHp.hp) {
          return Math.min(prevHp + bossHp.regen, bossHp.hp);
        }
        return prevHp;
      });
  
      if (!defeated && !!bossHp.regen) {
        const regenSpan = document.getElementById('regen-span');
        if (regenSpan) {
          regenSpan.style.opacity = '1';
          regenSpan.textContent = `+${bossHp.regen}`;
  
          setTimeout(() => {
            regenSpan.style.opacity = '0';
          }, 500);
        }
      }
    }, 1000);
  
    return () => clearInterval(interval);
  }, [bossHp, defeated]);

  useEffect(() => {
    if (defeated && hp === 0 && userData) {
      fetch('/api/bossLvl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: userData.uid,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Boss defeat data sent successfully:", data);
          setUserData((prev:any) => ({
            ...prev,
            lvlBosses: prev.lvlBosses + 1,
          }));
          setDefeated(false)
        })
        .catch((error) => {
          console.error("Error sending boss defeat data:", error);
        });

      setLocalClicks((prevClicks: number) => prevClicks + Math.floor(bossHp.hp * 1.3));
    }
  }, [defeated]);

  const handleTouchAndReduceHp = (e: React.TouchEvent<HTMLDivElement>) => {
    handleTouchStart(e);
    if (hp > 0) {
      const criticalHit = Math.random() < 0.2;
      const damage = criticalHit ? Math.floor(Number(userData?.damage) * 1.7) : Number(userData?.damage);

      setHp((prevHp) => {
        const newHp = prevHp - damage;
        if (newHp <= 0) {
          setDefeated(true);
          return 0;
        }
        return newHp;
      });

      const touch = e.touches[0];
      const newBloodDrop: BloodDrop = {
        id: Date.now(),
        damage,
        top: touch.clientY - circleRect!.top,
        left: touch.clientX - circleRect!.left,
        opacity: 1,
      };

      setBloodDrops((prev) => [...prev, newBloodDrop]);

      setTimeout(() => {
        setBloodDrops((prev) =>
          prev.map((drop) =>
            drop.id === newBloodDrop.id ? { ...drop, top: drop.top + 10, opacity: 0 } : drop
          )
        );
      }, 700);

      setTimeout(() => {
        setBloodDrops((prev) => prev.filter((drop) => drop.id !== newBloodDrop.id));
      }, 1000);
    }
  };

  return (
    <div className="p-4 text-roman-gold font-roman">
      <div
        ref={circleRef}
        className={`relative w-[300px] h-[300px] bg-roman-wood ${
          defeated ? 'opacity-50' : 'active:bg-roman-black'
        } rounded-full border-4 border-roman-gold flex justify-center items-center mx-auto`}
        onTouchStart={!defeated ? handleTouchAndReduceHp : undefined}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src="/images/openAiref1.jpg"
          alt="Training Dummy"
          className="w-full h-full object-cover rounded-full"
        />

        <div className="absolute top-2 left-0 w-full flex items-center justify-center">
          <div className="relative w-3/4 bg-roman-black h-6 rounded-full overflow-hidden">
            <div
              className={`absolute top-0 left-0 h-full transition-all duration-500 ${
                hp > 0 ? 'bg-roman-red' : 'bg-gray-500'
              }`}
              style={{ width: `${(hp / bossHp.hp) * 100}%` }}
            ></div>
          </div>
          <span className="ml-2 text-roman-red text-2xl font-extrabold">{hp}</span>
          <span
            id="regen-span"
            className="ml-2 text-green-500 text-lg font-bold"
            style={{ opacity: 0, transition: 'opacity 0.5s ease-out' }}
          ></span>
        </div>

        {defeated && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-roman-red text-4xl font-extrabold">
            DEFEATED
          </div>
        )}

        {bloodDrops.map((drop) => (
          <div
            key={drop.id}
            className="absolute transition-all duration-700"
            style={{
              top: `${drop.top}px`,
              left: `${drop.left}px`,
              opacity: drop.opacity,
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" fill="#8B0000" />
            </svg>
            <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-roman-gold text-sm font-bold">
              {drop.damage}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
