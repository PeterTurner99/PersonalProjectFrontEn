import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
export function Weekday({data, weekday, hourClass, dataClass}){
    const hours = [...Array(24).keys()];
    console.log(weekday)
    const finalHourClass = hourClass ? hourClass : ' p-5 m-2 rounded-md border-2 border-solid border-teal-800'
    const finalDataClass = dataClass ? dataClass : 'p-5 m-2 rounded-md border-2 border-solid border-teal-800'
    console.log(data,'day data')
    return (
        <div className={'flex flex-col gap-12'}>
            {hours.map((hour)=> (
                <Popover className=" "  key={`${weekday}-${hour}-str--`} id={`${weekday}-${hour}-str--`}>
                    <PopoverTrigger className=" min-h-6 max-h-6 mt-0.5  ">
                        <div  className="mt-0.5 min-w-24 max-h-12 flex overflow-auto w-fit max-w-24 gap-4">
                            { data[(hour) + ':00:00' ]&& 
                            <div className=" min-h-12  border">
                                <span className=" min-h-12  border">{data[(hour) + ':00:00' ].length} task(s)</span> 
                            </div>}
                        </div>
                    </PopoverTrigger>
                    <PopoverContent>
                        <div  className="flex gap-4" key={`${weekday}-${hour}`} id={`${weekday}-${hour}`}>
                            { data[(hour) + ':00:00' ] ? data[(hour) + ':00:00' ].map((hour_data, index)=>(
                                <Dialog key={`${weekday}-${hour}-${index}`}>
                                    <DialogTrigger>
                                    <div className="bg-accent-foreground  min-h-12  text-black  p-4 rounded-xl min-w-fit  "  id={`${weekday}-${hour}-${index}`}>
                                        <p>{hour_data.name}</p>
                                    </div>
                                    </DialogTrigger>
                                    <DialogContent>
                                         <DialogTitle>
                                            <DialogHeader>{hour_data.name}</DialogHeader>
                                        </DialogTitle>
                                        <p>{hour_data.description}</p>
                                        <p>{hour_data.time}</p>
                                    </DialogContent>
                                </Dialog>
                                
                            ))
                            : <div className="min-w-24 min-h-6"> </div>
                        }
                        </div>
                    </PopoverContent>
                </Popover>
            ))}
        </div>     
    )
}