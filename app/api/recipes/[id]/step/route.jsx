import {NextResponse} from "next/server";
import {getToken} from "@/app/lib/auth";
import ApiProxy from "@/app/api/proxy";

const DJANGO_API_ENDPOINT = 'http://localhost:8000/api/recipes/'



export async function POST(request,{params}) {
    const {id} = await params

    const requestData = await request.json();
    const {data, status} = await ApiProxy.post(`${DJANGO_API_ENDPOINT}${id}/step/`,requestData, true)
    return NextResponse.json(data, {status: status})
}