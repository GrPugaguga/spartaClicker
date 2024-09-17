import { setNewItem } from "@/app/firebase/setNewItem"
import { NextResponse } from "next/server"


export async function POST(request: Request) {
    const {uid,itemName,itemPrice} = await request.json()
    const item = await setNewItem(uid,itemName,itemPrice)
    if(item){
            // Возвращаем данные пользователя, если они найдены
            return NextResponse.json({
                message: 'item added',
            });

    }else {
        return NextResponse.json({message : "error"}, {status: 401})
    }
}
