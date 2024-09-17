import { setUserBoss } from "@/app/firebase/setUserBoss"
import { NextResponse } from "next/server"


export async function POST(request: Request) {
    const {uid} = await request.json()
    const boss = await setUserBoss(uid)

    if(boss){
            // Возвращаем данные пользователя, если они найдены
            return NextResponse.json({
                message: 'boss lvl is upgrate!',
            });

    }else {
        return NextResponse.json({message : "error"}, {status: 401})
    }
}
