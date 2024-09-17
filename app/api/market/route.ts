import { NextResponse } from "next/server"
import {getMarket} from './../../firebase/getMarket.js'

export async function GET() {
    const resp = await getMarket()

    if(resp){
        // Возвращаем данные пользователя, если они найдены
        return NextResponse.json({
            message: 'Market',
            market: resp
        });

}else {
    return NextResponse.json({message : "error"}, {status: 401})
}


}