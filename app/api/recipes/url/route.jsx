import ApiProxy from "@/app/api/proxy";
import {NextResponse} from "next/server";
const DJANGO_API_ENDPOINT = 'http://localhost:8000/api/recipes/url/'
export async function POST(request) {
    const requestData = await request.json();

    const {data, status} = await ApiProxy.post(DJANGO_API_ENDPOINT, requestData, true)

    return NextResponse.json({data}, {status: status})


}