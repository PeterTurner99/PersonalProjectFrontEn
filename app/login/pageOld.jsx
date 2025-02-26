"use client"
// const LOGINURL = "http://localhost:8000/api/token/pair";
import {useAuth} from "../components/authProvider";


const LOGINURL = "/api/login";


export default function Page() {
    const auth = useAuth();
    async function handleSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const objectFromFormData = Object.fromEntries(formData);
        const jsonData = JSON.stringify(objectFromFormData);
        const requestOptions = {
            method: "POST",
            body: jsonData,
            headers: {
                "Content-Type": "application/json"
            },
        }
        const response = await fetch(LOGINURL, requestOptions)
        const data = await response.json();
        if (response.ok){
            auth.login()
        }
    }


    return (
        <div className="h-[95vh]">
            <div className="max-w-md mx-auto py-5">
                <h1>login</h1>
                <form onSubmit={handleSubmit}>
                    <input type={'text'} required name={'username'} placeholder={'Your Username'}/>
                    <input type={'password'} required name={'password'} placeholder={'Your Password'}/>

                        <button type={"submit"}>Login</button>
                </form>
            </div>
        </div>

)


}