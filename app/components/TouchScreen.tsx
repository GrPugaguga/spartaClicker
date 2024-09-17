"use client"; // Component runs on the client side

import { useState, useRef, useEffect,Touch } from "react";
import useTouchTracking from "@/hooks/useTouchTracker";
import { UserData } from "./../types"; // Import the UserData type from types

interface TouchScreenProps {
  setLocalClicks: (clicks: any) => void;
  userData: UserData | null;
  setUserData: React.Dispatch<React.SetStateAction<UserData | null>>;
}

export default function TouchScreen({ setLocalClicks, userData, setUserData }: TouchScreenProps) {
  const { touchInfo, handleTouchStart, handleTouchEnd } = useTouchTracking(setLocalClicks);
  const circleRef = useRef<HTMLDivElement | null>(null);
  const [circleRect, setCircleRect] = useState<DOMRect | null>(null);
  const [hp, setHp] = useState<number>(0); // Initial HP as number
  const [bossHp, setBossHp] = useState<{ hp: number; regen: number }>({
    hp: 0,
    regen: 0,
  });
  const [defeated, setDefeated] = useState<boolean>(false); // Defeated state
  const [lastDamage, setLastDamage] = useState<number>(0); // Last damage state

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
            hp:data.bossData.hp,
            regen:data.bossData.regen
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
        // Prevent HP regeneration if the boss is defeated (HP is 0)
        if (prevHp === 0 || defeated || !bossHp.regen) {
          return prevHp;
        }
        // Prevent HP from exceeding the boss's maximum HP
        if (prevHp < bossHp.hp) {
          return Math.min(prevHp + bossHp.regen, bossHp.hp);
        }
        return prevHp;
      });
  
      // Show +regen next to the HP bar, only if the boss is not defeated
      if (!defeated && !!bossHp.regen) {
        const regenSpan = document.getElementById('regen-span');
        if (regenSpan) {
          regenSpan.style.opacity = '1';
          regenSpan.textContent = `+${bossHp.regen}`;
  
          setTimeout(() => {
            regenSpan.style.opacity = '0'; // Fade it out after 500ms
          }, 500);
        }
      }
    }, 1000); // 1000 ms interval
  
    return () => clearInterval(interval); // Cleanup interval when the component unmounts
  }, [bossHp, defeated]);
  

  useEffect(() => {
    if (defeated && hp === 0 && userData) {
      fetch('/api/bossLvl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: userData.uid, // User ID
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

  const handleTouchAndReduceHp = (e:any) => {
    handleTouchStart(e);
    if (hp > 0) {
      const criticalHit = Math.random() < 0.2; // 20% critical hit chance
      const damage = criticalHit ? Math.floor(Number(userData?.damage) * 1.7) : Number(userData?.damage); // Convert userData.damage to number

      setHp((prevHp) => {
        const newHp = prevHp - damage;
        if (newHp <= 0) {
          setDefeated(true); // Set defeated state when HP reaches 0
          return 0;
        }
        return newHp;
      });

      setLastDamage(damage); // Set the last damage
    }
  };

  return (
    <div className="p-4 text-white">
      <div
        ref={circleRef}
        className={`relative w-[300px] h-[300px] bg-yellow-500 ${
          defeated ? 'opacity-50' : 'active:bg-yellow-800'
        } rounded-full border-1 border-yellow-900 flex justify-center items-center mx-auto`}
        onTouchStart={!defeated ? handleTouchAndReduceHp : undefined} 
        onTouchEnd={handleTouchEnd}
      >
        <img
          src="/images/openAiref1.jpg"
          alt="Training Dummy"
          className="w-full h-full object-cover rounded-full"
        />

<div className="absolute top-2 left-0 w-full flex items-center justify-center">
  <div className="relative w-3/4 bg-gray-400 h-4 rounded-full">
    <div
      className={`absolute top-0 left-0 h-4 rounded-full transition-all duration-500 ${
        hp > 0 ? 'bg-red-500' : 'bg-gray-500'
      }`}
      style={{ width: `${(hp / bossHp.hp) * 100}%` }} // Reduce width based on HP
    ></div>
  </div>
  <span className="ml-2 text-red-500 text-2xl font-extrabold">{hp}</span>
  {/* Display +regen */}
  <span
    id="regen-span"
    className="ml-2 text-green-500 text-lg font-bold"
    style={{ opacity: 0, transition: 'opacity 0.5s ease-out' }}
  ></span>
</div>

        {defeated && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-red-600 text-4xl font-extrabold">
            DEFEATED
          </div>
        )}

        {circleRect &&
          touchInfo.touchPoints.length > 0 &&
          touchInfo.touchPoints.map((touch: Touch) => (
            <div
              key={touch.identifier}
              className="absolute flex items-center justify-center z-50"
              style={{
                top: `${touch.clientY - circleRect.top/2 + 64}px`,
                left: `${touch.clientX - circleRect.left}px`,
              }}
            >
            
                <div className="relative flex items-center space-x-1">
                  <div className="rounded-full flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-16 h-16"
                      viewBox="0 0 24 24"
                      fill="red"
                      stroke="red"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 2.5s-6 6.5-6 10.5a6 6 0 0012 0c0-4-6-10.5-6-10.5z"></path>
                      <circle cx="12" cy="16" r="1"></circle>
                    </svg>
                  </div>
                  <span className="text-red-500 text-4xl font-extrabold">{lastDamage}</span>
                </div>
             
            </div>
          ))}
      </div>
    </div>
  );
}
