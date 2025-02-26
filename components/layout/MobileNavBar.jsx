"use client"
import Link from "next/link";
import { Menu} from "lucide-react";

import {Button} from "@/components/ui/button"

import {Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet";
import {NavLinks} from './NavLinks'
import {useAuth} from "../authProvider";
import BrandLink from "./BrandLink";




export default function MobileNavbar({className}){
    const auth = useAuth()
    const finalClass = className ? className : "sticky top-0 flex h-16 items-center gap-4 border-b" +
        "bg-background px-4 md:px-6"
    return (

            <Sheet>
                <SheetTrigger asChild>
                    <Button variant={'outline'}
                            size={'icon'}
                            className={'shrink-0 md:hidden'}>
                        <Menu className={'w-5 h-5'}/>
                        <span className={'sr-only'}>Toggle Navigation Menu</span>
                    </Button >
                </SheetTrigger>
                <SheetContent side={'left'}>
                    <BrandLink displayName={true} className={'text-muted-foreground transition-colors hover:text-foreground'}/>
                    {NavLinks.map((navLinkItem,index) => {
                        const shouldDisplay = (auth.isAuthenticated === navLinkItem.authRequired )|| !navLinkItem.authRequired
                        return !shouldDisplay ? null : <Link key={`nav-links-b-${index}`} href={navLinkItem.href} className="text-muted-foreground transition-colors hover:text-foreground">
                            {navLinkItem.label}
                        </Link>

                    })}
                    {auth.isAuthenticated &&
                        <Link href={'/logout'} className="text-muted-foreground transition-colors hover:text-foreground">
                            Logout
                        </Link>
                    }
                </SheetContent>
            </Sheet>

    )
}