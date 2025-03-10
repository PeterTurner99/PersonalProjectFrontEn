import {NextResponse} from "next/server";
import ApiProxy from "@/app/api/proxy";

const DJANGO_API_ENDPOINT = 'http://localhost:8000/api/menu/search/'
const DJANGO_POST_ENDPOINT = 'http://localhost:8000/api/menu/add/'

export async function GET(request) {
    const searchParams = request.nextUrl.searchParams
    console.log(request, searchParams)
    const requestData = {
        search: searchParams.get('date')
    }
    console.log(requestData)
    const {data, status} = await ApiProxy.post(DJANGO_API_ENDPOINT, requestData, true)

    return NextResponse.json(data, {status: status})
}


export async function POST(request) {
    const requestData = await request.json();
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('date')
    console.log(searchParams)
    requestData['date'] = search
    const {data, status} = await ApiProxy.post(DJANGO_POST_ENDPOINT, requestData, true)

    return NextResponse.json({data}, {status: status})
}
