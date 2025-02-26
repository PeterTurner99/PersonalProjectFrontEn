"use client"

import useSWR from "swr";
import {useEffect} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import {usePathname} from "next/navigation";

const {createContext, useContext, useState} = require('react');

const AuthContext = createContext(null)


const LOGIN_REDIRECT_URL = '/'
const LOGOUT_REDIRECT_URL = '/login'
const LOGIN_REQUIRED_URL = '/login'
const LOCAL_STORAGE_KEY = 'is-logged-in'
const LOCAL_USERNAME_KEY = 'username'
export function AuthProvider({children}) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userName, setUserName] = useState("");
    const router = useRouter();
    const pathname = usePathname()
    const searchParams = useSearchParams()

    useEffect(() => {
        const storedAuthStatus = localStorage.getItem(LOCAL_STORAGE_KEY)
        if (storedAuthStatus) {
            const storedAuthStatusNum = parseInt(storedAuthStatus)
            setIsAuthenticated(storedAuthStatusNum === 1)
        }
        const storedUN = localStorage.getItem(LOCAL_USERNAME_KEY)
        if (storedUN) {
            setUserName(storedUN)
        }
    }, [])




    const login = (username) => {
        setIsAuthenticated(true)
        localStorage.setItem(LOCAL_STORAGE_KEY, '1')
        if (username){
            localStorage.setItem(LOCAL_USERNAME_KEY, `${username}`)
            setUserName(username)
        }else{
            localStorage.removeItem(LOCAL_USERNAME_KEY)
        }

        let nextUrl = searchParams.get('next')
        const invalidNextUrl = ['/login', '/logout']
        const nextUrlValid = nextUrl && nextUrl.startsWith('/') && !invalidNextUrl.includes(nextUrl)

        if (!nextUrlValid) {
            nextUrl = LOGIN_REDIRECT_URL
        }
        router.replace(nextUrl)
    }
    const loginRequiredRedirect = () => {
        console.log("asdas")
        setIsAuthenticated(false)
        localStorage.setItem(LOCAL_STORAGE_KEY, '0')
        let loginWithNextUrl = `${LOGIN_REQUIRED_URL}?next=${pathname}`
        if (LOGIN_REQUIRED_URL === pathname) {
            loginWithNextUrl = LOGIN_REQUIRED_URL
        }
        router.replace(loginWithNextUrl)
    }
    const logout = () => {
        setIsAuthenticated(false)
        localStorage.setItem(LOCAL_STORAGE_KEY, '0')
        localStorage.setItem(LOCAL_USERNAME_KEY, null)
        setUserName(null)
        router.replace(LOGOUT_REDIRECT_URL)
    }
    return <AuthContext.Provider value={{isAuthenticated, login, logout, loginRequiredRedirect, userName}}>
        {children}
    </AuthContext.Provider>
}

export function useAuth() {
    return useContext(AuthContext)
}