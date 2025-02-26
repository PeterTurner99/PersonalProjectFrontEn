"use client"
import Link from "next/link";
import { CircleUser, Menu, Package2, Search} from "lucide-react";

import {Button} from "@/components/ui/button"
import {
    Card, CardContent, CardDescription, CardTitle, CardFooter, CardHeader
} from "@/components/ui/card"

import {Checkbox} from "@/components/ui/checkbox"

import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "../ui/dropdown-menu";

import {input} from '@/components/ui/input'
import {Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet";
import {NavLinks, NonUserLinks} from './NavLinks'
import {useAuth} from "../authProvider";
import BrandLink from "./BrandLink";
import MobileNavbar from "./MobileNavBar";
import AccountDropdown from "./AccountDropdown";
import {usePathname} from "next/navigation";




export default function Navbar({className}){
    const auth = useAuth()
    const path = usePathname()
    const finalClass = className ? className : "sticky top-0 flex h-16 items-center gap-4 border-b" +
        "bg-background px-4 md:px-6"
    console.log(path, ' ---> path')
    return (
        <header className={finalClass}>
            <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
                <BrandLink displayName={true}/>
                {NavLinks.map((navLinkItem,index) => {
                    const shouldDisplay = (auth.isAuthenticated === navLinkItem.authRequired )|| !navLinkItem.authRequired
                    return !shouldDisplay ? null :
                    <Link href={navLinkItem.href}
                          className={` transition-colors hover:text-foreground ${(path).includes(navLinkItem.linkName) ? ("front") : ('text-muted-foreground') }`} key={`nav-links-a-${index}`}>
                        {navLinkItem.label}
                    </Link>

                })}

            </nav>
            <MobileNavbar/>
            <div className={'flex w-full items-center justify-end gap-4 md:ml-auto md:gap-2 lg:gap-4'}>
                {auth.isAuthenticated ?
                <AccountDropdown/>
                :
                    NonUserLinks.map((navLinkItem,index) => {
                            const shouldDisplay = (auth.isAuthenticated === navLinkItem.authRequired )|| !navLinkItem.authRequired
                            return !shouldDisplay ? null : <Link key={`nav-links-c-${index}`} href={navLinkItem.href} className="text-muted-foreground transition-colors hover:text-foreground">
                                {navLinkItem.label}
                            </Link>
                        })
                }
            </div>
        </header>
    )
}