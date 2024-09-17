'use client';

import { useEffect, useState, useCallback } from 'react';
import debounce from 'lodash.debounce';
import TouchScreen from './components/TouchScreen';
import { UserData as UserDataType } from './types'; // Import the UserData type


export default function Home() {
    const [userData, setUserData] = useState<UserDataType | null>(null);
    const [localClicks, setLocalClicks] = useState<number>(0);

    useEffect(() => {
        getUserData();

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
    }, []);

    useEffect(() => {
        if (localClicks === 0) return;
        updateClicksOnServer(localClicks);
    }, [localClicks]);


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

                if (!res.ok) throw new Error(`Error: ${res.status}`);

                const data = await res.json();
                if (data.user) {
                    setUserData(data.user);
                } else {
                    console.log('User not found');
                }
            } catch (error) {
                console.error('Error during authentication:', error);
            }
        }
    }, []);


    const updateClicksOnServer = useCallback(
        debounce(async (totalClicks) => {
            try {
                fetch('/api/click', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        uid: userData?.uid,
                        clicks: totalClicks,
                    }),
                });
                setUserData((prev:any) => ({
                    ...prev,
                    clicks: prev.clicks + totalClicks,
                }));
                setLocalClicks(0);
            } catch (error) {
                console.error('Error during click update:', error);
            }
        }, 1000),
        [userData]
    );

    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-black m-0 p-0">
        <div className="flex flex-col justify-between items-center space-y-4 p-8 h-screen">
            {userData ? (
                <>
                    <div className="absolute top-4 left-4 text-yellow-500">
                        {userData.username}
                    </div>
                    <div className="absolute top-12 left-4 text-yellow-500">
                        GOLD: {userData.clicks + localClicks}
                    </div>
                    <div className="absolute top-24 left-4 text-yellow-500">
                        LVL: {userData.lvlBosses}
                    </div>
                </>
            ) : (
                <div>User not found</div>
            )}

            <TouchScreen
                setLocalClicks={setLocalClicks}
                userData={userData}
                setUserData={setUserData}
            />
        </div>
        </main>
    );
}
