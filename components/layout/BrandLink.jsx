"use client"
import Link from "next/link";
import {  Package2} from "lucide-react";



export default function BrandLink({displayName,className}){
    const finalClass = className? className : "flex items-center gap-2 text-lg font-semibold md:text-base"
    return <Link href="/" className={finalClass}>
        <Package2 className={"w-6 h-6"}/>
        { displayName ?
            <span>Name</span>
            :
            <span className={'sr-only'}> Name</span>
        }
    </Link>
}

