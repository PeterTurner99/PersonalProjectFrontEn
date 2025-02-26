"use server"
import {setRefreshToken, setToken} from "@/app/lib/auth";

const DJANGOLOGINURL = "http://localhost:8000/api/token/pair";
import {NextResponse} from "next/server";

export async function POST(request){
    const requestData = await request.json();

    const jsonData = JSON.stringify(requestData);
    const requestOptions = {
        method: "POST",
        body: jsonData,
        headers: {
            "Content-Type": "application/json"
        },
    }
    const response = await fetch(DJANGOLOGINURL, requestOptions)
    const ResponseData = await response.json();

    if (response.ok){
        const {username, access, refresh} = ResponseData

        await setToken(access);
        await setRefreshToken(refresh);
    return await NextResponse.json({'loggedIn': true, 'username': username}, {status:200})

    }
    return NextResponse.json({'loggedIn': false, ... ResponseData}, {status:400})


}