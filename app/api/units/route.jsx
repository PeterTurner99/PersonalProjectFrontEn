import {NextResponse} from "next/server";
import ApiProxy from "@/app/api/proxy";

const DJANGO_API_ENDPOINT = 'http://localhost:8000/api/recipes/units/'

export async function GET(request) {
    const {data, status} = await ApiProxy.get(DJANGO_API_ENDPOINT, true)
    return NextResponse.json(data, {status: status})
}
