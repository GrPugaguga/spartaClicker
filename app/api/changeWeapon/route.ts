import { NextResponse } from "next/server"
import {getUserWeapon} from './../../firebase/getUserWeapon'
import getUserData from "@/app/firebase/getUserData"

export async function POST(request: Request) {
    const {uid,username,weapon} = await request.json()
    console.log(weapon)
    const resp = await getUserWeapon({uid,weapon})

    if(resp){
        // Возвращаем данные пользователя, если они найдены
        const user = await getUserData({uid,username})
        return NextResponse.json({
            message: 'boss added',
            userData: user
        });

}else {
    return NextResponse.json({message : "error"}, {status: 401})
}


}