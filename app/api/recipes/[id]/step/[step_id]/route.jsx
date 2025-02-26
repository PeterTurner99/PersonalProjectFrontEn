import ApiProxy from "@/app/api/proxy";
import {NextResponse} from "next/server";

const DJANGO_API_ENDPOINT = 'http://localhost:8000/api/recipes/'

export async function PUT(request,{params}) {
    const {id, step_id} = await params

    const requestData = await request.json();
    const {data, status} = await ApiProxy.put(`${DJANGO_API_ENDPOINT}${id}/step/${step_id}/`,requestData, true)
    return NextResponse.json(data, {status: status})
}