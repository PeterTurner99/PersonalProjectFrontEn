"use client"
import Link from "next/link";
import { Menu} from "lucide-react";

import {Button} from "@/components/ui/button"

import {Sheet, SheetContent, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import {NavLinks} from './NavLinks'
import {useAuth} from "../authProvider";
import BrandLink from "./BrandLink";
import { usePathname } from "next/navigation";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";




export default function MobileNavbar({className}){
    const auth = useAuth()
    const path = usePathname()
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
                <SheetTitle></SheetTitle>
                    <BrandLink displayName={true} className={'text-muted-foreground transition-colors hover:text-foreground'}/>
                    {NavLinks.map((navLinkItem,index) => {
                        const shouldDisplay = (auth.isAuthenticated === navLinkItem.authRequired )|| !navLinkItem.authRequired
                        return !shouldDisplay ? null : 
                        // <p  key={`nav-links-b-${index}`}>
                        //     <Link href={navLinkItem.href} className={` transition-colors hover:text-foreground ${(path).includes(navLinkItem.linkName) ? ("front") : ('text-muted-foreground')}`}>
                        //         {navLinkItem.label}
                        //     </Link>
                        // 
                        <div  key={`nav-links-b-${index}`}>
                        <HoverCard >
                            <HoverCardTrigger  href={navLinkItem.href}
                            className={` transition-colors hover:text-foreground ${(path).includes(navLinkItem.linkName) ? ("front") : ('text-muted-foreground')}`}>
                            {navLinkItem.label}
                            </HoverCardTrigger>
                            <HoverCardContent className={`flex bg-accent rounded-xl flex-col gap-2 p-4 ${navLinkItem.subLinks.length == 0 ? 'hidden' : 'no'}`}>
                                {(navLinkItem.subLinks).map((subLinkItem, index) => (
                                    <div key={`nav-links-b-${index}`}>
                                        {subLinkItem.href ? (
                                        <div className="flex flex-col gap-2">
                                            <Link href={subLinkItem.href} className="text-muted-foreground transition-colors hover:text-foreground">
                                                {subLinkItem.label}
                                            </Link>
                                        </div>
                                        ) : <span></span>}
                                    </div>
                                ))}
                            </HoverCardContent>
                        </HoverCard>
                    </div>
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