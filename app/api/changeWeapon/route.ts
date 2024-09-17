import { NextResponse } from "next/server"
import {getUserWeapon} from './../../firebase/getUserWeapon'

export async function POST(request: Request) {
    const {uid,weapon} = await request.json()
    console.log(weapon)
    const resp = await getUserWeapon({uid,weapon})
    if(resp){
        // Возвращаем данные пользователя, если они найдены
        return NextResponse.json({
            message: 'weapon is changed',
        });

}else {
    return NextResponse.json({message : "error"}, {status: 401})
}


}