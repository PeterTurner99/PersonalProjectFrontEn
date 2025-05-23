import {NextResponse} from "next/server";
import ApiProxy from "@/app/api/proxy";

const DJANGO_API_ENDPOINT = 'http://localhost:8000/api/menu/recurring/'
const DJANGO_POST_ENDPOINT = 'http://localhost:8000/api/menu/search/week/'
export async function POST(request) {
    const requestData = await request.json();
    const {data, status} = await ApiProxy.post(DJANGO_API_ENDPOINT, requestData, true)

    return NextResponse.json({data}, {status: status})
}


export async function GET(request){

    const requestData = {
        search: new Date().toISOString()
    }
    console.log(requestData)
    const {data, status} = await ApiProxy.post(DJANGO_POST_ENDPOINT, requestData, true)

    return NextResponse.json(data, {status: status})
}