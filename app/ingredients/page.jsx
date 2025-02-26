"use client"
import {useRouter} from "next/navigation";

import useSWR, {useSWRConfig} from "swr";

import {useAuth} from "@/components/authProvider";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import Link from "next/link";
import {DialogHeader, Dialog, DialogTitle, DialogTrigger, DialogContent, DialogClose} from "@/components/ui/dialog";
import {DialogBody} from "next/dist/client/components/react-dev-overlay/internal/components/Dialog";
import {FileXIcon} from "lucide-react"
import {Button} from "@/components/ui/button";

const INGREDIENTS_URL = "/api/ingredients";


export default function Page() {
    const router = useRouter();
    const {mutate} = useSWRConfig()
    const fetcher = async url => {
        const res = await fetch(url);
        if (res.redirected) {
            router.push(res.url)

        }
        if (!res.ok) {
            const error = new Error('Something went wrong');
            error.info = await res.json();
            error.status = res.status;
            throw error;
        }
        return res.json();
    }
    async function deleteIngredient(ingredient_id) {
        const requestOptions = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
        }
        const response = await fetch(`${INGREDIENTS_URL}/${ingredient_id}`, requestOptions)
        mutate(INGREDIENTS_URL)
    }

    // Get Request
    const {data, error, isLoading} = useSWR(INGREDIENTS_URL, fetcher);
    // const {data:authedData, error:authedError, isLoading:authedIsLoading} = useSWR(IS_AUTHED, fetcher);
    const auth = useAuth()

    if (error) return <div>Error: {error.message}</div>;
    if (isLoading) return <div>Loading...</div>;


    return (
        <div>
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
                <ScrollArea>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((ingredient, id) => (
                                <TableRow
                                    key={`ingredient-${id}`}>
                                    <TableCell>
                                        <span className={'cursor-pointer'}
                                              onClick={e => router.push(`ingredient/${ingredient.id}`)}>
                                            {ingredient.name}
                                        </span>

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
                                                                onClick={() =>deleteIngredient(ingredient.id)}>
                                                            Submit
                                                        </Button>
                                                    </DialogClose>
                                                </DialogBody>
                                            </DialogContent>
                                        </Dialog>

                                    </TableCell>
                                </TableRow>))
                            }
                        </TableBody>
                    </Table>
                </ScrollArea>
                <Link href={'/ingredients/upload/'} className={'border p-4 rounded-xl bg-background ml-auto mr-auto'}>
                    Add new
                </Link>
            </main>
        </div>
    )
}