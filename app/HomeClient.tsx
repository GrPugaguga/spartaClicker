'use client';

import { useState,useEffect, useCallback } from 'react';
import debounce from 'lodash.debounce';
import TouchScreen from './components/TouchScreen';
import { useUser } from './context/UserContext';
import LoadingSpinner from './components/LoadingSpinner';


export default function HomeClient() {
    const { userData, setUserData, isLoading, bossHp,setBossHp } = useUser();
    const [localClicks, setLocalClicks] = useState<number>(0);

    useEffect(() => {
        const handleBeforeUnload = () => {
            if (localClicks > 0 && userData) {
                navigator.sendBeacon('/api/click', JSON.stringify({
                    uid: userData.uid,
                    username: userData.username,
                    clicks: userData.clicks + localClicks,
                }));
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [localClicks, userData]);

    useEffect(() => {
        if (localClicks === 0) return;
        updateClicksOnServer(localClicks);
    }, [localClicks]);

    const updateClicksOnServer = useCallback(
        debounce(async (totalClicks) => {
            if (!userData) return;
            try {
                const response = await fetch('/api/click', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        uid: userData.uid,
                        clicks: totalClicks,
                    }),
                });
                if (!response.ok) throw new Error(`Error: ${response.status}`);
                setUserData((prev) => prev ? ({
                    ...prev,
                    clicks: prev.clicks + totalClicks,
                }) : null);
                setLocalClicks(0);
            } catch (error) {
                console.error('Error during click update:', error);
            }
        }, 1000),
        [userData, setUserData]
    );

    if (isLoading) return <LoadingSpinner />;

    return (
        <div className="relative w-full h-screen flex flex-col justify-between items-center p-8">
            {userData ? (
                <div className="absolute top-4 left-4 flex flex-col space-y-2">
                    <div className="bg-roman-wood text-roman-gold px-3 py-1 rounded-full shadow-lg">
                        <span className="font-bold">{userData.username}</span>
                    </div>
                    <div className="bg-roman-gold text-roman-black px-3 py-1 rounded-full shadow-lg">
                        <span className="font-semibold">GOLD: </span>
                        <span className="font-bold">{userData.clicks + localClicks}</span>
                    </div>
                    <div className="bg-roman-red text-roman-gold px-3 py-1 rounded-full shadow-lg">
                        <span className="font-semibold">LVL: </span>
                        <span className="font-bold">{userData.lvlBosses}</span>
                    </div>
                </div>
            ) : (
                <div className="text-roman-red font-bold text-xl">User not found</div>
            )}


            <div className="w-full h-full flex items-center justify-center">
                <TouchScreen
                    setLocalClicks={setLocalClicks}
                    userData={userData}
                    setUserData={setUserData}
                    bossHp = {bossHp}
                    setBossHp={setBossHp}
                />
            </div>
        </div>
    );
}