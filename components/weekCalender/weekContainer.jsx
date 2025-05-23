import { Weekday } from "./weekday";



export function WeekContainer(
    {weekDayArray,
    data,
    classNameArray,}
){
    console.log(weekDayArray, 'weekday array')
    console.log(data)
    weekDayArray = weekDayArray ? weekDayArray : []
    return (
        <div className="weekContainer flex p-3 absolute ml-20 mt-24">
            {weekDayArray.map((weekDay, index) => (
                <div key={`weekday-div-${index}`} className={classNameArray[weekDay] ? classNameArray[weekDay]: 'flex border border-foreground rounded-xl flex-col p-3 m-5 mt-8 pt-2' }>
                    <Weekday weekday={weekDay} data={data[weekDay]}/>
                </div>   
            ))
            }
        </div>
            
    )
}