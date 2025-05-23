"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {useState} from "react";
import {Textarea} from "@/components/ui/textarea";
import {Time_Picker} from '@/components/ui/time-picker';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
const RECURRING_API_URL = "/api/calendar/recurring";
export function RecurringForm({
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
        console.log(formData)
        const objectFromFormData = Object.fromEntries(formData);
        const jsonData = JSON.stringify(objectFromFormData);
        const requestOptions = {
            method: "POST",
            body: jsonData,
            headers: {
                "Content-Type": "application/json"
            },
        }
        const response = await fetch(RECURRING_API_URL, requestOptions)
        

        if (response.status === 201 || response.status === 200){
            setMessage('Recurring Task added successfully');
            event.target.reset();

        }
        else{
            const data = await response.json();
            setErrors(data);
            SError('Error adding Recurring Task');
        }
    }

    return (

        <form onSubmit={handleSubmit} className="p-6 md:p-8">
            {message &&  <div className={'bg-accent'}>{message}</div>}
            {error && <div className={'bg-destructive p-3 font-semibold text-sm rounded-md text-white'}> {error}</div>}
            <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                    <h1 className="text-2xl font-bold">Add New Recurring Task</h1>
                </div>
                <div className="{errors.name ? 'border-destructive' : ''}">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Recurring task name</Label>
                        <Input
                            id="name"
                            type="text"
                            placeholder="Name"
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
                
                <div className="grid gap-2">
                    <div className="flex items-center">
                        <Label htmlFor="frequency">Frequency</Label>

                    </div>
                    <Select name={'frequency'} required>
                        <SelectTrigger className=" w-1/2 inline-flex ml-4  ">
                            <SelectValue placeholder="How often to repeat?" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value={'m'}>
                                    Monthly
                                </SelectItem>
                                <SelectItem value={'d'}>
                                    Daily
                                </SelectItem>
                                <SelectItem value={'w'}>
                                    Weekly
                                </SelectItem>
                                <SelectItem value={'f'}>
                                    Fortnightly
                                </SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid gap-2">
                    <div className="flex items-center">
                        <Label htmlFor="time">Time</Label>

                    </div>
                    <Time_Picker id='time' name='time' increment={5} />
                </div>
                <div className="grid gap-2">
                    <div className="flex items-center">
                        <Label htmlFor="day">Day</Label>

                    </div>
                    <Select name={'day'}>
                        <SelectTrigger className=" w-1/2 inline-flex ml-4  ">
                            <SelectValue placeholder="Which day of the week?" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value={'0'}>
                                    Monday
                                </SelectItem>
                                <SelectItem value={'1'}>
                                    Tuesday
                                </SelectItem>
                                <SelectItem value={'2'}>
                                    Wednesday
                                </SelectItem>
                                <SelectItem value={'3'}>
                                    Thursday
                                </SelectItem>
                                <SelectItem value={'4'}>
                                    Friday
                                </SelectItem>
                                <SelectItem value={'5'}>
                                    Saturday
                                </SelectItem>
                                <SelectItem value={'6'}>
                                    Sunday
                                </SelectItem>
                                <SelectItem value={null}>
                                    None
                                </SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                
                <div className="grid gap-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Input
                        id="duration"
                        type="number"
                        placeholder="Duration"
                        name={'duration'}
                        required
                        />
                </div>

                
                <Button type="submit" className="w-full">
                    Submit
                </Button>
            </div>
        </form>

    )
}
