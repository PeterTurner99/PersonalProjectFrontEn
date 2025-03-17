"use client"
import useSWR, {useSWRConfig} from "swr";
import {useState} from "react";
import {useAuth} from "@/components/authProvider";
import {useParams, useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";
import {Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {DialogBody} from "next/dist/client/components/react-dev-overlay/internal/components/Dialog";
import {Textarea} from "@/components/ui/textarea";
import FormAndMethod from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {CornerRightDown, FileXIcon, Pencil} from 'lucide-react'
import DialogueForm from "@/components/ui/dialogueForm";
import {DragDropContext, Draggable, Droppable} from "@hello-pangea/dnd";
import useSWRMutation from "swr/mutation";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Checkbox} from "@/components/ui/checkbox";

const fetcher = async url => {
    const res = await fetch(url);
    if (!res.ok) {
        const errorInfo = await res.json();
        const error = new Error(errorInfo);
        error.info = errorInfo;
        error.status = res.status;
        if (res.status === 404) {
            error.message = "Recipe not found"
        }
        throw error;
    }
    return res.json();
}


async function update_ingredient_search(url, {arg}) {
    const res = await fetch(`${url}${arg}`)
    const res_json = await res.json()
    let error = undefined
    if (!res.ok) {
        const errorInfo = await res.json();
        error = new Error(errorInfo);
        error.info = errorInfo;
        error.status = res.status;
        if (res.status === 404) {
            error.message = "Ingredients not found"
        }
    }
    return {data: res_json, error: error}
}


const INGREDIENTS_URL = '/api/ingredients/search';
const RECIPES_URL = "/api/recipes";
const UNITS_URL = '/api/units';
export default function Home() {
    const {mutate} = useSWRConfig();
    const [recipeSteps, setRecipeSteps] = useState([]);
    const [ingredients, setIngredients] = useState([]);
    const [ingredient, setIngredient] = useState('');
    const [publicVal, setPublicVal] = useState(null);
    const [showIngredientSearch, setShowIngredientSearch] = useState(true);
    const router = useRouter();
    const params = useParams()
    const id = params.id
    const [ingredient_search, setIngredientSearch] = useState("");
    const {data, error, isLoading} = useSWR(`${RECIPES_URL}/${id}`, fetcher);
    let {
        data: ingredient_data,
        error: ingredient_error,
        isMutating: ingredient_isLoading,
        trigger
    } = useSWRMutation(`${INGREDIENTS_URL}?search=`, update_ingredient_search);
    const {data: unit_data, error: unit_error, isLoading: unit_isLoading} = useSWR(`${UNITS_URL}`, fetcher);
    async function deleteIngredientAndAmount(ingredient_id) {
        const requestOptions = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
        }
        const response = await fetch(`${RECIPES_URL}/${id}/${ingredient_id}`, requestOptions)
        mutate(`${RECIPES_URL}/${id}`)
    }
    const auth = useAuth()
    async function changeCheckbox(val){
        setPublicVal(val)
        const jsonData = JSON.stringify({
            'public' : val
        })

        const requestOptions = {
            method: 'PUT',
            body: jsonData,
            headers: {
                "Content-Type": "application/json"
            },
        }
        const response = await fetch(`${window.location.protocol}//${window.location.host}//${'api/recipes/' + id}`, requestOptions)
        if (response.status == 201 || response.status == 200){
            const responseData = await response.json()
        }else{
            const data = await response.json();
            console.log(data, 'these are errors')
        }
    }

    const handleDrop = async (droppedItem) => {
        if (!droppedItem.destination) {
            return;
        }
        var updatedList = [...recipeSteps]
        const [reorderedItem] = updatedList.splice(droppedItem.source.index, 1)
        updatedList.splice(droppedItem.destination.index, 0, reorderedItem);
        console.log(updatedList, 'test')
        let new_order = []
        updatedList.map((item, index) => {
            new_order.push([item.id, index]);
        })
        const json_data = JSON.stringify({'ordering': new_order});
        const requestOptions = {
            method: 'POST',
            body: json_data,
            headers: {
                "Content-Type": "application/json"
            },
        }
        const response = await fetch(`${window.location.protocol}//${window.location.host}/api/recipes/${id}/reorder/`, requestOptions)

        if (response.status == 201 || response.status == 200) {
            mutate(`${RECIPES_URL}/${id}`)
        }
        setRecipeSteps(updatedList)
    }
    if (error) return (
        <div>
            <div>
                Error: {error.message}
            </div>

            <Button onClick={() => router.push("/recipes")}>Back to Recipes</Button>
        </div>
    );
    if (isLoading) return <div>Loading...</div>;
    if (!ingredient_data && !ingredient_error) {
        trigger('')
    }
    if (data?.recipeSteps && recipeSteps.length === 0 && data?.recipeSteps.length > 0) {
        setRecipeSteps(data.recipeSteps);
    }
    if (data && publicVal == null) {
        setPublicVal(data.public)
    }
    return (
        <main className="flex flex-col max-h-screen overflow-scroll gap-8 row-start-2 items-center sm:items-start">
            <div>
                <h1 className={"text-xl underline "}>{data?.name && data.name}
                    <Dialog>
                        <DialogTrigger className={'gap-4 ml-5'}>
                            <Pencil className={"gap-4"}/>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Edit recipe name</DialogTitle>
                            </DialogHeader>
                            <DialogBody>
                                <FormAndMethod method={'PUT'} url={'api/recipes/' + id}
                                               className={'flex flex-col gap-4'} keyValue={`${RECIPES_URL}/${id}`}>
                                    <Input id="name" type="text" name={'name'}
                                           defaultValue={data?.name && data.name}></Input>
                                    <DialogClose asChild>
                                        <Button type="submit">Save</Button>
                                    </DialogClose>
                                </FormAndMethod>
                            </DialogBody>
                        </DialogContent>
                    </Dialog>

                </h1>

            </div>
            <form id={'public-form'}>
                <div className="flex align-middle gap-4">
                    <Checkbox  id={'public'} name={'public'} checked={publicVal} onCheckedChange={(val) =>changeCheckbox(val)} ></Checkbox>
                    <label htmlFor="public">Public</label>
                </div>
            </form>

            <Dialog>
                <DialogTrigger>
                    <div>
                        <span>
                            {data?.description ? data.description : "No description"}
                        </span>
                    </div>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit description</DialogTitle>
                    </DialogHeader>
                    <DialogBody>
                        <FormAndMethod method={'PUT'} url={'api/recipes/' + id} className={'flex flex-col gap-4'}
                                       keyValue={`${RECIPES_URL}/${id}`}>
                            <Textarea id="description" type="text" name={'description'}
                                      defaultValue={data?.description && data.description}></Textarea>
                            <DialogClose asChild>
                                <Button type="submit">Save</Button>
                            </DialogClose>
                        </FormAndMethod>
                    </DialogBody>
                </DialogContent>
            </Dialog>

            <div>
                <h3 className={"text-lg underline"}>Ingredients</h3>
                {data?.ingredients ?
                    <div> {data.ingredients.map((ingredient, i) => (
                        <div key={`ingredient-display-${i}`} className={'flex flex-col mt-4'}>

                            <p>
                                {ingredient.amount} {ingredient.units_str} of {ingredient.name}{ingredient.details && (<span> {ingredient.details}</span>)}
                                <Dialog>
                                    <DialogTrigger>
                                        <FileXIcon className={'ml-5 w-1/3 inline'}/>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Delete this item </DialogTitle>
                                        </DialogHeader>

                                        <DialogBody>
                                            <p>Are you sure you want to delete this item?</p>
                                            <DialogClose asChild>
                                                <Button type={"button"} className={'ml-auto  mr-auto block mt-5'}
                                                        onClick={() =>deleteIngredientAndAmount(ingredient.id)}>
                                                    Submit
                                                </Button>
                                            </DialogClose>
                                        </DialogBody>
                                    </DialogContent>
                                </Dialog>
                            </p>
                        </div>
                    ))}</div> : <p>test </p>

                }
                <Dialog onOpenChange={() => {
                    setIngredient('')
                    setShowIngredientSearch(true);
                    trigger('');
                }}>
                    <DialogTrigger className={'gap-4 ml-5 mt-10'}>
                        <span><CornerRightDown className={'inline'}/> Add new Ingredient</span>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add new Ingredient</DialogTitle>
                        </DialogHeader>
                        <DialogBody>
                            <FormAndMethod method={'POST'} url={'api/recipes/' + id + '/ingredients/'}
                                           className={'flex flex-col gap-4'} keyValue={`${RECIPES_URL}/${id}`}>

                                <div>
                                    <label htmlFor="name" className={'mb-2'}>Name</label>
                                    <Input required className={'mb-2'} name={'name'} id={'name'} value={ingredient}
                                           placeholder="Ingredient name" onChange={value => {
                                        setIngredientSearch(value.target.value);
                                        trigger(value.target.value);
                                        setIngredient(value.target.value);
                                        setShowIngredientSearch(true);
                                    }}/>
                                    <div className={'mb-2 rounded-md ' + (showIngredientSearch ? '' : 'hidden')}>
                                        {(!ingredient_data) ? <p></p> : <div>
                                            {ingredient_data?.data && ingredient_data.data.map((mapped_ingredient, index) => (
                                                <div value={mapped_ingredient.name}
                                                     className={'bg-white text-accent p-1 border border-accent rounded-sm cursor-pointer  '}
                                                     onClick={event => {
                                                         setIngredient(mapped_ingredient.name);
                                                         trigger(mapped_ingredient.name);
                                                         setShowIngredientSearch(false);
                                                     }} key={`ingredient-${index}`}>
                                                    {mapped_ingredient.name}
                                                </div>))}
                                        </div>}
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="amount">Amount</label>
                                    <Input className={'ml-3 mr-3 w-1/4 inline'} required type="number" name="amount"
                                           id="amount"/>
                                    <label htmlFor="units">Units</label>

                                    <Select name={'unit_id'} required>
                                        <SelectTrigger className=" w-1/4 inline-flex ml-4  ">
                                            <SelectValue placeholder="Units"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {unit_data && unit_data.map((mapped_unit, index) => (
                                                    <SelectItem key={`unit-${index}`}
                                                                value={mapped_unit.id.toString()}>{mapped_unit.name}</SelectItem>

                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>

                                </div>
                                <Button type="submit">Save</Button>
                            </FormAndMethod>
                        </DialogBody>
                    </DialogContent>
                </Dialog>
            </div>

            <Dialog>
                <DialogTrigger>
                    <div>
                        {data?.duration ? <div>
                            <h3 className={'underline '}>Duration:</h3>
                            {data.duration} minutes </div> : <span>No duration</span>}
                    </div>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit duration</DialogTitle>
                    </DialogHeader>
                    <DialogBody>
                        <FormAndMethod method={'PUT'} url={'api/recipes/' + id} className={'flex flex-col gap-4'}
                                       keyValue={`${RECIPES_URL}/${id}`}>
                            <Input id="duration" type="number" name={'duration'}
                                   defaultValue={data?.duration && data.duration}></Input>
                            <DialogClose asChild>
                                <Button type="submit">Save</Button>
                            </DialogClose>
                        </FormAndMethod>
                    </DialogBody>
                </DialogContent>
            </Dialog>

            <div>
                <h3 className={'text-l underline'}>Recipe steps</h3>
                <DragDropContext onDragEnd={handleDrop}>
                    <Droppable droppableId={"Steps"}>
                        {(provided, snapshot) => (
                            <div className={'list-container w-96'} {...provided.droppableProps} ref={provided.innerRef}>
                                {recipeSteps && recipeSteps.map((step, index) => (
                                    <Draggable key={index} index={index} draggableId={(index).toString()}>
                                        {(provided) => (
                                            <div
                                                className="item-container w-lg flex flex-col p-5 m-2 rounded-md border-2 border-solid border-teal-800"
                                                {...provided.dragHandleProps}
                                                {...provided.draggableProps} ref={provided.innerRef}>
                                                <p className={'flex gap-4 mb-5'}>
                                                    <span className={'underline'}>Step {index + 1}:</span>
                                                    <DialogueForm url={'api/recipes/' + id + `/step/${step.id}`}
                                                                  keyValue={`${RECIPES_URL}/${id}`}
                                                                  field={'shortDesc'}
                                                                  data={step}
                                                                  type={'text'}>
                                                        {step.shortDesc ? step.shortDesc :
                                                            <span></span>}
                                                    </DialogueForm>
                                                </p>
                                                <DialogueForm url={'api/recipes/' + id + `/step/${step.id}`}
                                                              keyValue={`${RECIPES_URL}/${id}`}
                                                              field={'duration'}
                                                              data={step}
                                                              type={'number'}>
                                                    <p className={"text-left"}>{step.duration  && <span>Duration: {step.duration} minutes</span>}</p>
                                                </DialogueForm>
                                                <DialogueForm url={'api/recipes/' + id + `/step/${step.id}`}
                                                              keyValue={`${RECIPES_URL}/${id}`}
                                                              field={'description'}
                                                              data={step}
                                                              type={'text'}>
                                                    <p className={"text-left"}>Description: {step.description}</p>
                                                </DialogueForm>

                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                            </div>
                        )}
                    </Droppable>

                    {/*{ data?.recipeSteps && data.recipeSteps.map((step, index) => (*/}
                    {/*        <div key={index} className={'flex flex-col gap-4'}>*/}
                    {/*            <p>Step {step.order}: </p>*/}
                    {/*            <DialogueForm url={'api/recipes/' + id + `/step/${step.id}`}*/}
                    {/*                          keyValue={`${RECIPES_URL}/${id}`}*/}
                    {/*                          field={'description'}*/}
                    {/*                          data={step}*/}
                    {/*                          type={'text'}>*/}
                    {/*                Description: {step.description}*/}
                    {/*            </DialogueForm>*/}

                    {/*            <DialogueForm url={'api/recipes/' + id + `/step/${step.id}`}*/}
                    {/*                          keyValue={`${RECIPES_URL}/${id}`}*/}
                    {/*                          field={'duration'}*/}
                    {/*                          data={step}*/}
                    {/*                          type={'number'}>*/}
                    {/*                Duration: {step.duration}*/}
                    {/*            </DialogueForm>*/}

                    {/*            <Separator></Separator>*/}
                    {/*        </div>*/}
                    {/*))}*/}
                </DragDropContext>
                <Dialog>
                    <DialogTrigger className={'gap-4 ml-5 mt-10'}>
                        <span><CornerRightDown className={'inline'}/> Add new step</span>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add new Recipe Step</DialogTitle>
                        </DialogHeader>
                        <DialogBody>
                            <FormAndMethod method={'POST'} url={'api/recipes/' + id + '/step'}
                                           className={'flex flex-col gap-4'} keyValue={`${RECIPES_URL}/${id}`}>
                                <div>
                                    <label htmlFor="shortDesc">Short description or title</label>
                                    <Input required id="shortDesc" type="text" name={'shortDesc'}/>
                                </div>
                                <div>
                                    <label htmlFor="duration">Duration (minutes)</label>
                                    <Input required id="duration" type="number" name={'duration'}/>
                                </div>
                                <div>
                                    <label htmlFor="description">Description</label>
                                    <Textarea required id="description" type="text" name={'description'}></Textarea>
                                </div>
                                <Button type="submit">Save</Button>
                            </FormAndMethod>
                        </DialogBody>
                    </DialogContent>
                </Dialog>
            </div>

        </main>
    );
}
