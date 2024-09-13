'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import debounce from 'lodash.debounce'; // или можешь использовать свою реализацию
import TouchScreen from './TouchScreen.jsx'

export default function TelegramAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userData, setUserData] = useState<any>(null);
    const [localClicks, setLocalClicks] = useState<number>(0); // Локальное состояние для кликов
    const router = useRouter();

    useEffect(() => {
        checkAuth();
        getUserData();


        const handleBeforeUnload = () => {
            if (localClicks > 0 && userData) {
                // Отправляем клики на сервер перед закрытием вкладки
                navigator.sendBeacon('/api/click', JSON.stringify({
                    uid: userData.uid,
                    username: userData.username,
                    clicks: userData.clicks + localClicks,
                }));
            }
        };
    
        // Добавляем обработчик события перед закрытием
        window.addEventListener('beforeunload', handleBeforeUnload);
    
        // Очищаем обработчик при размонтировании компонента
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };

        
    }, []);

    useEffect(() => {

        if(localClicks == 0) return
        updateClicksOnServer(localClicks);

    },[localClicks])




    // Проверка сессии пользователя
    const checkAuth = useCallback(async () => {
        const response = await fetch('api/session');
        if (response.ok) {
            setIsAuthenticated(true);
        }
    }, []);

    // Получение данных пользователя
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

    // Аутентификация пользователя
    const authenticateUser = useCallback(async () => {
        const WebApp = (await import('@twa-dev/sdk')).default;
        WebApp.ready();
        const initData = WebApp.initData;

        if (initData) {
            try {
                const response = await fetch('/api/auth', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ initData }),
                });

                if (response.ok) {
                    setIsAuthenticated(true);
                    router.refresh();
                } else {
                    console.error('Authentication failed');
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error('Error during authentication:', error);
                setIsAuthenticated(false);
            }
        }
    }, [router]);

    // Оптимизированный click handler с троттлингом (ограничивает частоту обновлений)
    const updateClicksOnServer = useCallback(
        debounce(async (totalClicks:any) => {
            try {
                 fetch('/api/click', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        uid: userData.uid,
                        username: userData.username,
                        clicks: totalClicks,
                    }),
                });
                setUserData((prev:any) => ({
                    ...prev,
                    clicks: prev.clicks + totalClicks,
                }));
                setLocalClicks(0); // сбрасываем локальный счётчик
            } catch (error) {
                console.error('Error during click update:', error);
            }
        }, 1000), // задержка 1 секунда для предотвращения частых запросов
        [userData]
    );

    // Обработка кликов с обновлением локального состояния
    const click = () => {
        if (!userData) return;

        setLocalClicks(prevClicks => prevClicks + 1);
    }

    return (
        <div className="flex flex-col items-center space-y-4 p-8">
            {isAuthenticated ? (
                <>
                    {userData ? (
                        <div className='text-yellow-500'>
                            {userData.username}: {userData.clicks + localClicks}
                        </div>
                    ) : (
                        <div>User not found</div>
                    )}


                    <TouchScreen setLocalClicks={setLocalClicks} />
                    <div
                        onClick={(e) => {
                            e.preventDefault()
                            click()
                        }}
                        className="bg-blue-500  active:bg-blue-800 hover:bg-blue-700 text-white font-bold py-10 px-20 rounded select-none"
                    >
                        Click
                    </div>
                </>
            ) : (
                <div>
                    <p>You need to be the owner of this account</p>
                    <button
                        onClick={authenticateUser}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Authenticate
                    </button>
                </div>
            )}
        </div>
    );
}
