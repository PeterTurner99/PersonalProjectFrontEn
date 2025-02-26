import {NextResponse} from "next/server";
import {getToken} from "@/app/lib/auth";
import ApiProxy from "@/app/api/proxy";

const DJANGO_API_ENDPOINT = 'http://localhost:8000/api/recipes/ingredients/'

export async function GET(request) {
    const {data, status} = await ApiProxy.get(DJANGO_API_ENDPOINT, true)
    return NextResponse.json(data, {status: status})
}


export async function POST(request) {
    const requestData = await request.json();
    const {data, status} = await ApiProxy.post(DJANGO_API_ENDPOINT, requestData, true)
    return NextResponse.json({data}, {status: status})
}

