import ApiProxy from "@/app/api/proxy";
import {NextResponse} from "next/server";
const DJANGO_API_ENDPOINT = 'http://localhost:8000/api/recipes/'

export async function DELETE(request, {params}) {
    const {id, secondary_id} = await params
    console.log(id, secondary_id)
    const {data, status} = await ApiProxy.delete(`${DJANGO_API_ENDPOINT}${id}/${secondary_id}/delete/`, true)
    return NextResponse.json({data}, {status: status})
}