import {NextResponse} from "next/server";
import ApiProxy from "@/app/api/proxy";

const DJANGO_API_ENDPOINT = 'http://localhost:8000/api/recipes/search/'

export async function GET(request) {
    const searchParams = request.nextUrl.searchParams
    const requestData = {
        name: searchParams.get('search')
    }

    const {data, status} = await ApiProxy.post(DJANGO_API_ENDPOINT, requestData, true)

    return NextResponse.json(data, {status: 200})
}

