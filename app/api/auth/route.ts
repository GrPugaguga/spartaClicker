import { saveUserData } from "@/app/firebase/saveUserData"
import { encrypt, SESSION_DURATION } from "@/app/utils/session"
import { validateTelegramWebAppData } from "@/app/utils/telegramAuth"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"


export async function POST(request: Request) {
    const {initData} = await request.json()

    const validationResult = validateTelegramWebAppData(initData)

    if(validationResult.validatedData){
        const user = {telegramId: validationResult.user.id}

        const expires = new Date(Date.now() + SESSION_DURATION)
        const session = await encrypt({user,expires})

        cookies().set("session", session, {expires, httpOnly: true})
        saveUserData(validationResult.user.id,validationResult.user.username)
        return NextResponse.json({ message: "Authenticated successful"})

    }else {
        return NextResponse.json({message : validationResult.message}, {status: 401})
    }
}