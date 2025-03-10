import ApiProxy from "@/app/api/proxy";
import {NextResponse} from "next/server";

const DJANGO_POST_ENDPOINT = 'http://localhost:8000/api/menu/month/'

export async function GET(request) {
    const searchParams = request.nextUrl.searchParams
    console.log(request, searchParams)
    const requestData = {
        search: searchParams.get('date')
    }
    console.log(requestData)
    const {data, status} = await ApiProxy.post(DJANGO_POST_ENDPOINT, requestData, true)

    return NextResponse.json(data, {status: status})
}
