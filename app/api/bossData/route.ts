import getBossData from "@/app/firebase/getBossData"
import { NextResponse } from "next/server"


export async function POST(request: Request) {
    const {lvl} = await request.json()

        const BossData:any = await getBossData({lvl})
        console.log(BossData)
        if (BossData) {
            // Возвращаем данные пользователя, если они найдены
            return NextResponse.json({
                message: 'new boss',
                bossData: BossData,
                lvl:lvl
            });
        } else {
            // Если данных нет
            return NextResponse.json({
                message: 'User not found'
            }, { status: 404 });
        }
}
