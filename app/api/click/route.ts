import { setUserClick } from "@/app/firebase/setUserClick"
import { NextResponse } from "next/server"


export async function POST(request: Request) {
    const {uid,clicks} = await request.json()
    const click = await setUserClick(uid, clicks)
    if(click){
            // Возвращаем данные пользователя, если они найдены
            return NextResponse.json({
                message: 'add user gold',
            });
        } else {
            // Если данных нет
            return NextResponse.json({
                message: 'can`t add gold'
            }, { status: 404 });
        }

}