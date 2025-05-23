import ApiProxy from "@/app/api/proxy"
import { NextResponse } from "next/server"

const DJANGO_API_ENDPOINT = 'http://localhost:8000/api/recipes/push/set_default/'

export async function GET(request, {params}){
    const {id} = await params
    console.log({'id': parseInt(id)})
    const {data, status} = await ApiProxy.post(DJANGO_API_ENDPOINT, {'id': parseInt(id)}, true)
    return NextResponse.json({data}, {status: status})
    
}

