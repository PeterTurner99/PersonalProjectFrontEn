import {cookies} from 'next/headers';

const TOKEN_AGE = 3600
const AUTH_TOKEN_NAME = "auth-token";
const REFRESH_TOKEN_NAME = "refresh-token";

export async function getToken() {
    const cookieStore = await cookies()
    const myAuthToken = await cookieStore.get(AUTH_TOKEN_NAME);
    return await myAuthToken?.value
}

export async function getRefreshToken() {
    const cookieStore = await cookies()
    const myAuthToken = await cookieStore.get(REFRESH_TOKEN_NAME);
    return await myAuthToken?.value
}


export async function setToken(authToken) {
    const cookieStore = await cookies()
    return await cookieStore.set({
        name: AUTH_TOKEN_NAME,
        value: authToken,
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV !== 'development',
        maxAge: TOKEN_AGE
    })
}


export async function setRefreshToken(authRefreshToken) {
    const cookieStore = await cookies()
    return await cookieStore.set({
        name: REFRESH_TOKEN_NAME,
        value: authRefreshToken,
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV !== 'development',
        maxAge: TOKEN_AGE
    })
}


export async function deleteToken() {
    const cookieStore = await cookies()
    const myAuthToken = await cookieStore.delete(AUTH_TOKEN_NAME);
    await cookieStore.delete(REFRESH_TOKEN_NAME);
    return await myAuthToken
}