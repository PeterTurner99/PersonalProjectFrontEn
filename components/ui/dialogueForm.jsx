import {Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {DialogBody} from "next/dist/client/components/react-dev-overlay/internal/components/Dialog";
import FormAndMethod from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useState} from "react";


export default function DialogueForm({children, url, keyValue, field, data,type}){
    const [open, setOpen] = useState(false);

    return (<Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
            <div>
                {children}
            </div>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Edit {field}</DialogTitle>
            </DialogHeader>
            <DialogBody>
                <FormAndMethod  method={'PUT'}  url={url} className={'flex flex-col gap-4'} keyValue={keyValue} setOpen={setOpen}>
                    <Input  id={field} type={type} name={field} defaultValue={data?.[field] && data[field]}></Input>
                    {/*<DialogClose asChild>*/}
                        <Button type="submit">Save</Button>
                    {/*</DialogClose>*/}
                </FormAndMethod>
            </DialogBody>
        </DialogContent>
    </Dialog>)
}