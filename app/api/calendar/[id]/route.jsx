import ApiProxy from "@/app/api/proxy";
import {NextResponse} from "next/server";

const DJANGO_POST_ENDPOINT = 'http://localhost:8000/api/menu/update/'


export async function PUT(request, {params}) {
    const {id} = await params
    const requestData = await request.json();
    const {data, status} = await ApiProxy.put(`${DJANGO_POST_ENDPOINT}${id}/`, requestData, true)

    return NextResponse.json({data}, {status: status})
}
