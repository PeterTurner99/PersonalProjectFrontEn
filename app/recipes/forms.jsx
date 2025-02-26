"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {useState} from "react";
import {Textarea} from "../../components/ui/textarea";
import {NextResponse} from "next/server";
const RECIPE_API_URL = "/api/recipes";
export function RecipeForm({
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
        const response = await fetch(RECIPE_API_URL, requestOptions)


        if (response.status === 201 || response.status === 200){
            setMessage('Recipe added successfully');

        }
        else{
            const data = await response.json();
            setErrors(data);
            SError('Error adding recipe');
        }
    }

    return (

        <form onSubmit={handleSubmit} className="p-6 md:p-8">
            {message &&  <div className={'bg-accent'}>{message}</div>}
            {error && <div className={'bg-destructive p-3 font-semibold text-sm rounded-md text-white'}> {error}</div>}
            <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                    <h1 className="text-2xl font-bold">Add New Recipe</h1>
                </div>
                <div className="{errors.name ? 'border-destructive' : ''}">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Recipe Name</Label>
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
                <div className="grid gap-2">
                    <div className="flex items-center">
                        <Label htmlFor="description">Description</Label>

                    </div>
                    <Textarea id="description" type="text" name={'description'}  />
                </div>
                <Button type="submit" className="w-full">
                    Submit
                </Button>
            </div>
        </form>

    )
}
