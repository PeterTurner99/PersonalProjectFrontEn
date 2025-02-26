"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {useState} from "react";
import {Textarea} from "../../components/ui/textarea";
import {NextResponse} from "next/server";
const INGREDIENT_URL = "/api/ingredients/";
export function IngredientForm({
                               className,
                               ...props
                           }) {
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({})
    const [error,SError] = useState('');
    async function handleSubmit(event) {
        setErrors({});
        SError('');
        setMessage('')
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
        const response = await fetch(INGREDIENT_URL, requestOptions)


        if (response.status === 201 || response.status === 200){
            setMessage('Ingredient added successfully');
            event.target.reset()

        }
        else{
            const data = await response.json();
            setErrors(data?.data?.messages);
            SError('Error adding Ingredient');
        }
    }

    return (

        <form onSubmit={handleSubmit} className="p-6 md:p-8">
            {message &&  <div className={'bg-accent'}>{message}</div>}
            {error && <div className={'bg-destructive p-3 mb-5 font-semibold text-sm rounded-md text-white'}>
                {errors?.map((error, index) => (<p key={`error-${index}`}>{error}</p>))}
            </div>}
            <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                    <h1 className="text-2xl font-bold">Add New Ingredient</h1>
                </div>
                <div className="{errors.name ? 'border-destructive' : ''}">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Ingredient Name</Label>
                        <Input
                            id="name"
                            type="text"
                            placeholder="name"
                            name={'name'}
                            required
                        />
                    </div>
                    <div>
                        {errors.name && <div className="p-2 bg-destructive text-white">
                            {errors?.name.map((error,id)=>{
                                <p key={`err-${id}`}></p>
                            })}</div>}
                    </div>
                </div>

                <Button type="submit" className="w-full">
                    Submit
                </Button>
            </div>
        </form>

    )
}
