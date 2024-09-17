import { NextResponse } from "next/server";
import { validateTelegramWebAppData } from "@/app/utils/telegramAuth";
import getUserData from '@/app/firebase/getUserData';

export async function POST(request: Request) {
    try {
        const { initData } = await request.json();
        const validationResult = validateTelegramWebAppData(initData);

        // Получаем данные пользователя
        const userData = await getUserData({
           uid: String(validationResult.user.id), 
           username: String(validationResult.user.username)
        });

        if (userData) {
            // Возвращаем данные пользователя, если они найдены
            return NextResponse.json({
                message: 'User data found',
                user: userData
            });
        } else {
            // Если данных нет
            return NextResponse.json({
                message: 'User not found'
            }, { status: 404 });
        }
    } catch (error) {
        console.error("Ошибка при обработке запроса: ", error);
        return NextResponse.json({
            message: 'Ошибка сервера',
            error: (error as Error).message
        }, { status: 500 });
    }
}
