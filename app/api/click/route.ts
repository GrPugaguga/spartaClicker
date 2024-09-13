import getUserData from "@/app/firebase/getUserData"
import { setUserClick } from "@/app/firebase/setUserClick"
import { NextResponse } from "next/server"


export async function POST(request: Request) {
    const {uid,username,clicks} = await request.json()
    const click = await setUserClick(uid, clicks)

    if(click){
        const userData:any = await getUserData({uid,username})
        if (userData) {
            // Возвращаем данные пользователя, если они найдены
            return NextResponse.json({
                message: 'clicks added',
                clicks: userData.clicks
            });
        } else {
            // Если данных нет
            return NextResponse.json({
                message: 'User not found'
            }, { status: 404 });
        }
    }else {
        return NextResponse.json({message : "error"}, {status: 401})
    }
}