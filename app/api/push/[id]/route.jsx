import {NextResponse} from "next/server";
import ApiProxy from "@/app/api/proxy";
const DJANGO_API_ENDPOINT = 'http://localhost:8000/api/recipes/push/'

export async function DELETE(request, {params}) {
    const {id} = await params
    const {data, status} = await ApiProxy.delete(`${DJANGO_API_ENDPOINT}${id}/`, true)
    return NextResponse.json({data}, {status: status})
}


export async function GET(request, {params}){
    const {id} = await params
    const {data, status} = await ApiProxy.get(`${DJANGO_API_ENDPOINT}${id}/`, true)
    return NextResponse.json({data}, {status: status})
}

