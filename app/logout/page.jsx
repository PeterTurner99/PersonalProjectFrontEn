"use client"
import {useAuth} from "../../components/authProvider";

const LOGOUT_URL = 'api/logout'

export default function Page(){
    const auth = useAuth();

    async function handleClick(event) {
        event.preventDefault();
        const requestOptions = {
            method: "POST",
            body: "",
            headers: {
                "Content-Type": "application/json"
            },
        }
        const response = await fetch(LOGOUT_URL, requestOptions)
        const data = await response.json();
        if (response.ok){
            await auth.logout()
        }
    }


    return (
        <div className="h-[95vh]">
            <div className="max-w-md mx-auto py-5">
                <h1>Log out</h1>

                <button className={"bg-red-600"} onClick={handleClick}>Logout</button>
            </div>
        </div>
    )
}