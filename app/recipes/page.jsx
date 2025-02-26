"use client"
import useSWR from "swr";
import {useEffect} from "react";
import {useAuth} from "../../components/authProvider";
import {HoverCard, HoverCardContent, HoverCardTrigger} from '@/components/ui/hover-card'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import Link from "next/link";
import {ScrollArea} from '@/components/ui/scroll-area'

const fetcher = async url => {
    const res = await fetch(url);
    if ( !res.ok ) {
        const error =  new Error('Something went wrong');
        error.info = await res.json();
        error.status = res.status;
        throw error;
    }
    return res.json();
}

import {useRouter} from "next/navigation";
const RECIPES_URL = "/api/recipes";
const IS_AUTHED = '/api/is-authed'
export default function Home() {
    const router = useRouter();

    // Get Request
    const {data, error, isLoading} = useSWR(RECIPES_URL, fetcher);
    const {data:authedData, error:authedError, isLoading:authedIsLoading} = useSWR(IS_AUTHED, fetcher);
    const auth = useAuth()

    useEffect(() => {
        console.log(error)

    },[auth, error,authedData])

    if (error) return <div>Error: {error.message}</div>;
    if (isLoading) return <div>Loading...</div>;
    return (
        <div
            className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
                <ScrollArea>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Duration</TableHead>
                                <TableHead>Author</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            { data.map((recipe,id )=>(
                                <TableRow onClick={e=>router.push(`recipes/${recipe.id}`)} key={`recipe-${id}`}>
                                    <TableCell>
                                        <HoverCard>
                                            <HoverCardTrigger>
                                                {recipe.name}
                                            </HoverCardTrigger>
                                            <HoverCardContent>
                                                {recipe.description}
                                            </HoverCardContent>
                                        </HoverCard>
                                    </TableCell>
                                    <TableCell>{recipe.duration}</TableCell>
                                    <TableCell>{recipe.userStr}</TableCell>
                                </TableRow>))
                            }
                        </TableBody>
                    </Table>
                </ScrollArea>
                <Link href={'/recipes/upload/'} className={'border p-4 rounded-xl bg-background ml-auto mr-auto'}>
                    Add new
                </Link>
            </main>
        </div>
    );
}
