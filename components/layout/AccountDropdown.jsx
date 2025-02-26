"use client"
import Link from "next/link";
import {CircleUser, Menu, Package2, Search} from "lucide-react";

import {Button} from "@/components/ui/button"


import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "../ui/dropdown-menu";

import {NonUserLinks} from './NavLinks'
import {useAuth} from "../authProvider";
import {useRouter} from "next/navigation";


export default function AccountDropdown({className}) {
    const auth = useAuth()
    const router = useRouter()
    const finalClass = className ? className : "sticky top-0 flex h-16 items-center gap-4 border-b" +
        "bg-background px-4 md:px-6"
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant={'secondary'} size={'icon'} className={'rounded-full'}>
                    <CircleUser className={'w-5 h-5'}/>
                    <span className={'sr-only'}>Toggle user menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={'end'}>
                <DropdownMenuLabel>{auth.userName? auth.userName: 'Your account'}</DropdownMenuLabel>
                <DropdownMenuSeparator/>
                <DropdownMenuItem onClick={e => router.push('/logout')}>
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>


    )
}