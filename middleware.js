import {getRefreshToken} from "@/app/lib/auth";
import {NextResponse} from "next/server";

const LOGIN_REQUIRED_URL = '/login'
const protectedRoutes = ['/ingredients','/recipes']

export default async function middleware(req){
    const path = req.nextUrl.pathname
    console.log(path)

    // const isProtectedRoute = protectedRoutes.includes(path)
    const isProtectedRoute = path.match('/recipes|/ingredients|/calendar')
    const refreshToken = await getRefreshToken()
    if (!refreshToken && isProtectedRoute){
        console.log('test test test');
        console.log(new URL('/login/', req.nextUrl))
        let loginWithNextUrl = `${LOGIN_REQUIRED_URL}?next=${req.nextUrl.pathname}`
        if (LOGIN_REQUIRED_URL === req.nextUrl.pathname) {
            loginWithNextUrl = LOGIN_REQUIRED_URL
        }
        console.log(loginWithNextUrl);
        return NextResponse.redirect(new URL(loginWithNextUrl, req.url))
    }
    console.log(isProtectedRoute)
    console.log(refreshToken, isProtectedRoute);
    return NextResponse.next()
}