import {NextResponse} from "next/server";
import {getToken} from "@/app/lib/auth";
import ApiProxy from "@/app/api/proxy";

const DJANGO_API_ENDPOINT = 'http://localhost:8000/api/recipes/'

export async function GET(request,{params}) {
    const {id} = await params
    const searchParams = request.nextUrl.searchParams
    const {data, status} = await ApiProxy.get(`${DJANGO_API_ENDPOINT}${id}`, true)
    return NextResponse.json(data, {status: status})
}


export async function PUT(request,{params}) {
    const {id} = await params

    const requestData = await request.json();
    const {data, status} = await ApiProxy.put(`${DJANGO_API_ENDPOINT}${id}/`,requestData, true)
    return NextResponse.json(data, {status: status})
}