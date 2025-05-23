
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { ScrollArea } from './scroll-area';
export function Time_Picker({id,name, increment}){
    var id_to_use =  id ? id :  ''
    var name_to_use = name ? name : ''
    var increment_to_use = increment ? increment : 5
    const [time, setTime] = useState("12:00");
    return (
        <Select
        id={id_to_use} name={name_to_use} 
            defaultValue={time}
            onValueChange={(e) => {
            setTime(e);
            }}
        >
            <SelectTrigger className="font-normal focus:ring-0 w-[120px] focus:ring-offset-0">
            <SelectValue />
            </SelectTrigger>
            <SelectContent>
            <ScrollArea className="h-[15rem]">
                {Array.from({ length: (24 * (60 / increment_to_use)) }).map((_, i) => {
                const hour = Math.floor(i / (60 / increment_to_use))
                    .toString()
                    .padStart(2, "0");
                const minute = ((i % (60 / increment_to_use)) * increment_to_use)
                    .toString()
                    .padStart(2, "0");
                return (
                    <SelectItem key={i} value={`${hour}:${minute}`}>
                    {hour}:{minute}
                    </SelectItem>
                );
                })}
            </ScrollArea>
            </SelectContent>
        </Select>
    )
}