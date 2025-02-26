import {NextResponse} from "next/server";
import {getToken,setToken,setRefreshToken} from "@/app/lib/auth";
import {getRefreshToken} from "@/app/lib/auth";
const DJANGO_LOGIN_URL = "http://localhost:8000/api/token/pair";
const DJANGO_REFRESH_TOKEN = "http://localhost:8000/api/token/refresh"
export default class ApiProxy {

    static async getHeaders(requireAuth){
        let headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
        }
        const authToken = await getToken()
        if( authToken && requireAuth){
            await ApiProxy.refreshToken()
            headers['Authorization'] = `Bearer ${authToken}`
        }
        return headers
    }

    static async handleFetch(endpoint, requestOptions){
        let data = {}
        let status = 500
        try{
            console.log(endpoint, requestOptions)
            const response = await fetch(endpoint, requestOptions)
            console.log(response)
            data  = await response.json()
            console.log(data, 'test')
            status = response.status

        }
        catch (e){
            data = {message: 'Cannot reach API server', error:e}
            console.log(e, 'error')
        }
        return {data, status}
    }


    static async refreshToken(){
        const refreshToken = await getRefreshToken()
        const requestOptions = {
            method: "POST",
            body: JSON.stringify({'refresh': refreshToken}),
            headers: {
                "Content-Type": "application/json"
            },
        }

        const response = await fetch(DJANGO_REFRESH_TOKEN, requestOptions)
        const ResponseData = await response.json();

        if (response.ok){
            const {username, access, refresh} = ResponseData

            await setToken(access);
            await setRefreshToken(refresh);
        }
    }
    static async post(endpoint, object, requireAuth) {
        const headers = await ApiProxy.getHeaders(requireAuth)
        const jsonData = JSON.stringify(object);
        const requestOptions = {
            method: "POST",
            body: jsonData,
            headers: headers,
        }
        return  await  ApiProxy.handleFetch(endpoint, requestOptions)
    }
    static async delete(endpoint, requireAuth) {
        const headers = await ApiProxy.getHeaders(requireAuth)
        const requestOptions = {
            method: "DELETE",
            headers: headers,
        }
        return  await ApiProxy.handleFetch(endpoint, requestOptions)
    }


    static async put(endpoint, object, requireAuth) {
        const headers = await ApiProxy.getHeaders(requireAuth)
        const jsonData = JSON.stringify(object);
        const requestOptions = {
            method: "PUT",
            body: jsonData,
            headers: headers,
        }
        console.log(requestOptions)
        return   await  ApiProxy.handleFetch(endpoint, requestOptions)
    }


    static async get(endpoint, requireAuth) {
        const headers = await ApiProxy.getHeaders(requireAuth)
        const requestOptions = {
            method: "GET",
            headers: headers,
        }
        return  await ApiProxy.handleFetch(endpoint, requestOptions)
    }
}