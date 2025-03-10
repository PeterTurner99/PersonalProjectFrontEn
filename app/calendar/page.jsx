"use client"

import {Calendar} from "@/components/ui/calendar";
import {useEffect, useState} from "react";
import {Day, useDayPicker} from "react-day-picker";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import useSWRMutation from "swr/mutation";
import {Button} from "@/components/ui/button";
import FormAndMethod from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";

const CALENDAR_URL = "/api/calendar/";
const RECIPE_SEARCH_URL = "/api/recipes/search";

async function update_recipe_search(url, {arg}) {
    const res = await fetch(`${url}${arg}`)
    const res_json = await res.json()
    let error = undefined
    console.log(res_json)
    if (!res.ok) {
        const errorInfo = await res.json();
        error = new Error(errorInfo);
        error.info = errorInfo;
        error.status = res.status;
        if (res.status === 404) {
            error.message = "Recipes not found"
        }
    }
    return {data: res_json, error: error}
}


function UpdateChosenRecipe({item, shown, setOpen, trigger, keyValue}) {
    const [showRecipeSearch, setShowRecipeSearch] = useState(true);
    let {
        data: recipe_data,
        error: recipe_error,
        isMutating: recipe_isLoading,
        trigger: recipe_trigger
    } = useSWRMutation(`${RECIPE_SEARCH_URL}?search=`, update_recipe_search);
    const [recipe, setRecipe] = useState(item.recipeEntry.name);
    const [recipeSearch, setRecipeSearch] = useState("");
    console.log(item, shown)
    console.log(keyValue, 'key key ')
    if (!recipe_data && !recipe_error && shown) {
        console.log(item)
        recipe_trigger(item.recipeEntry.name)
    }
    return (<FormAndMethod method={'PUT'} url={`${CALENDAR_URL}/${item.id}`} className={'flex flex-col gap-4'}
                           setOpen={setOpen} trigger={trigger} keyValue={keyValue}>
        <div className={'flex flex-col gap-2'}>
            <label htmlFor="recipe">Recipe</label>
            <Input type={'text'} id={'recipe'} value={recipe} required name={'recipe'} onChange={value => {
                setRecipeSearch(value.target.value);
                recipe_trigger(value.target.value);
                setRecipe(value.target.value);
                setShowRecipeSearch(true);
            }}/>
            <div className={'mb-2 rounded-md ' + (showRecipeSearch ? '' : 'hidden')}>
                {(!recipe_data?.data) ? <p></p> : <div>
                    {recipe_data?.data && recipe_data.data.map((mapped_ingredient, index) => (
                        <div value={mapped_ingredient.name}
                             className={'bg-white text-accent p-1 border border-accent rounded-sm cursor-pointer  '}
                             onClick={event => {
                                 setRecipe(mapped_ingredient.name);
                                 recipe_trigger(mapped_ingredient.name);
                                 setShowRecipeSearch(false);
                             }} key={`ingredient-${index}`}>
                            {mapped_ingredient.name}
                        </div>))}
                </div>}
            </div>
            <Button type={'submit'}>Submit</Button>
        </div>
    </FormAndMethod>)
}


function PopoverContents({shown}) {
    const [date, setDate] = useState(null);
    const router = useRouter();
    const [editOpen, setEditOpen] = useState(false);

    async function update_calendar_search(url, {arg}) {
        setDate(arg)
        const res = await fetch(`${url}?date=${arg}`)
        let error = undefined
        let res_json = undefined
        if (!res.ok) {
            const errorInfo = await res.json();
            error = new Error(errorInfo);
            error.info = errorInfo;
            error.status = res.status;
            if (res.status === 404) {
                error.message = "No Menu Items found for this date";
            }

            throw error;
        } else {
            res_json = await res.json()
        }
        return {data: res_json, error: error}
    }

    async function editMenu(event) {
        event.preventDefault();
        setEditOpen(true);

    }

    const [showRecipeSearch, setShowRecipeSearch] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [recipe, setRecipe] = useState('');
    const [recipeSearch, setRecipeSearch] = useState("");
    let {
        data,
        error,
        isMutating,
        trigger
    } = useSWRMutation(`${CALENDAR_URL}`, update_calendar_search, {throwOnError: false});
    let {
        data: recipe_data,
        error: recipe_error,
        isMutating: recipe_isLoading,
        trigger: recipe_trigger
    } = useSWRMutation(`${RECIPE_SEARCH_URL}?search=`, update_recipe_search);
    console.log(data, error)
    if (!recipe_data && !recipe_error && shown) {
        recipe_trigger('')
    }
    return {
        popover_body: (<div>
            {error &&
                <p>{error.message} test</p>}
            {data?.data && data.data.map((item, index) => (
                <div key={`date-item-${index}`}>
                    <Link target="_blank" className={'mb-5'}
                          href={`/recipes/${item.recipeEntry.id}`}>
                        <div className={'p-3 border border-blue-900 rounded-2xl cursor-pointer'}>
                            <h3 className={'font-semibold underline'}>Time: {item.type}</h3>
                            <h4 className={'font-medium'}>Recipe: {item.recipeEntry.name}</h4>
                            <p className={'underline'}>Ingredients:</p>
                            <div>
                                {item.recipeEntry?.ingredients && item.recipeEntry.ingredients.map((ingredient, sub_index) => (
                                    <div key={`ingredient-${sub_index}`}>
                                        <p>{ingredient.amount} {ingredient.units_str} of {ingredient.name}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <Button onClick={(event) => {
                            editMenu(event)
                        }} className={'block ml-auto mr-auto mt-2 mb-3 bg-accent text-muted-foreground'}>Edit</Button>
                    </Link>
                    <Dialog open={editOpen} onOpenChange={() => {
                        setEditOpen(false)
                    }}>
                        <DialogTrigger><span></span></DialogTrigger>
                        <DialogContent>
                            <DialogTitle>
                                <DialogHeader>Change recipe</DialogHeader>
                            </DialogTitle>
                            <div>
                                <UpdateChosenRecipe item={item} shown={shown} setOpen={setEditOpen}
                                                    trigger={trigger} keyValue={date}
                                />
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            ))}

            <Button className="block ml-auto mt-2 mr-auto" onClick={() => setShowForm(!showForm)}>Show Form</Button>
            <div className={showForm ? 'block mt-5' : 'hidden'}>
                <FormAndMethod method={'POST'} url={`${CALENDAR_URL}?date=${date}`} className={'flex flex-col gap-4'}>
                    <div className={'flex flex-col gap-2'}>
                        <label htmlFor="recipe">Recipe</label>
                        <Input type={'text'} id={'recipe'} value={recipe} required name={'recipe'} onChange={value => {
                            setRecipeSearch(value.target.value);
                            recipe_trigger(value.target.value);
                            setRecipe(value.target.value);
                            setShowRecipeSearch(true);
                        }}/>
                        <div className={'mb-2 rounded-md ' + (showRecipeSearch ? '' : 'hidden')}>
                            {(!recipe_data?.data) ? <p></p> : <div>
                                {recipe_data?.data && recipe_data.data.map((mapped_ingredient, index) => (
                                    <div value={mapped_ingredient.name}
                                         className={'bg-white text-accent p-1 border border-accent rounded-sm cursor-pointer  '}
                                         onClick={event => {
                                             setRecipe(mapped_ingredient.name);
                                             recipe_trigger(mapped_ingredient.name);
                                             setShowRecipeSearch(false);
                                         }} key={`ingredient-${index}`}>
                                        {mapped_ingredient.name}
                                    </div>))}
                            </div>}
                        </div>
                        <div>
                            <label htmlFor="time">When?</label>
                            <Select name={'time'} required>
                                <SelectTrigger className=" w-1/2 inline-flex ml-4  ">
                                    <SelectValue placeholder="Time"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem
                                            value={'d'}>Dinner
                                        </SelectItem>

                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button type={'submit'}>Submit</Button>
                    </div>
                </FormAndMethod>
            </div>
        </div>), trigger: trigger
    }
}


export default function Page() {
    const [date, setDate] = useState(new Date())


    function handleDateChange(date) {
        setDate(date);
    }

    function DayButtonPopover(props) {
        const [open, setOpen] = useState(false);
        const [currentDate, setCurrentDate] = useState("");
        const dayPicker = useDayPicker()
        const {popover_body, trigger} = PopoverContents(open)
        useEffect(() => {
            setOpen(props.date.toISOString() === dayPicker?.selected?.toISOString());
            if (props.date.toISOString() === dayPicker?.selected?.toISOString()) {
                if (currentDate != props.date.toISOString()) {
                    console.log(currentDate, props.date.toISOString());
                    setCurrentDate(props.date.toISOString())
                    trigger(props.date.toISOString())
                }
            }
        })
        return (
            <div>
                <Day {...props}  >

                </Day>
                <Popover open={open}>
                    <PopoverTrigger><span></span></PopoverTrigger>
                    <PopoverContent>
                        {popover_body}
                    </PopoverContent>
                </Popover>
            </div>
        )
    }


    return (
        <div>
            <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateChange}
                components={{
                    Day: DayButtonPopover
                }
                }

                className="rounded-md border shadow"
            />
            <div className={'mt-10 ml-auto mr-auto text-center block '}>
                <Link className={'bg-accent-foreground rounded-xl p-4 text-accent'} href={'/calendar/quickview/'}>Quick
                    View</Link>
            </div>
        </div>
    )


}