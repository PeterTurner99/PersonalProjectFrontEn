import ApiProxy from "@/app/api/proxy";
import {NextResponse} from "next/server";

const DJANGO_API_ENDPOINT = 'http://localhost:8000/api/recipes/ingredients/'

export async function DELETE(request, {params}) {
    const {id} = await params
    const {data, status} = await ApiProxy.delete(`${DJANGO_API_ENDPOINT}${id}/`, true)
    return NextResponse.json({data}, {status: status})
}