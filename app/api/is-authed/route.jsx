import {NextResponse} from "next/server";
import {getRefreshToken} from "@/app/lib/auth";

export async function GET(request) {
    const token = await getRefreshToken()
    console.log(token)
    if(token){
        console.log('authed')
        return NextResponse.json({'authed':true}, {status:200})
    }
    return NextResponse.json({'authed':false}, {status: 200})
}
