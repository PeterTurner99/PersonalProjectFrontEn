// Accepts all inputs for children as well i.e. classnames

import { WeekContainer } from "./weekContainer"
import { WeekLabel } from "./weekLabel"

//
//
/*

Pass in data in form of 
{
    day:
        {
        hour : [task]
        }
}

*/

const DAYS_OF_WEEK = {
    0: 'Monday',
    1: 'Tuesday',
    2: 'Wednesday',
    3: 'Thursday',
    4: 'Friday',
    5: 'Saturday',
    6: 'Sunday'
}



const hours = [...Array(24).keys()];
function dict_from_data(data, startDate) {
    let endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + 7)
    console.log(data, 'data data')
    let return_dict = {}
    data.map(
        (data_obj, index) => {
            console.log(data_obj, 'data_obj')
            const recurringTasks = data_obj['recurringTasks']
            const given_date = data_obj['date']
            recurringTasks.map((recurringTask)=>
            {
                let hour = recurringTask.time
                
                const current_data = return_dict[given_date] ? return_dict[given_date] : {}
                const hour_data  = current_data[hour] ? current_data[hour] : []
                return_dict[given_date] = return_dict[given_date] ? return_dict[given_date] : {}
                hour_data.push(recurringTask)
                return_dict[given_date][hour] = hour_data
            })
            return_dict[given_date] = return_dict[given_date] ? return_dict[given_date] : {}
            
            
        }
    )
    console.log(return_dict)
    return return_dict
}


export function WeekCalendar(
    {data,
    className,
    startDate,
    weeklabel,
    weekcontainer,
    weeklabelClass,
    weekcontainerClass,
    start_on_current_day = false,}

) {
    const startDay = startDate.getDay()
    const processed_data = dict_from_data(data, startDay)
    console.log(processed_data)
    const currentDate = new Date()
    const currentDay = currentDate.getDay()
    const finalClassName = className ? className : ''
    const finalweeklabelClass = weeklabelClass ? weeklabelClass : ''
    const finalweekcontainerClass = weekcontainerClass ? weekcontainerClass : ''
    if (start_on_current_day) {
        const startingDay = currentDate.getDay()
    } else {
        const startingDay = startDay ? startDay : 0
    }
    const Final_week_label = weeklabel ? weeklabel : WeekLabel
    const Final_week_container = weekcontainer ? weekcontainer : WeekContainer
    

    return (
        <div className={finalClassName}>
            <Final_week_label className={finalweeklabelClass} data={processed_data} />
            <Final_week_container weekDayArray={Object.keys(processed_data)} classNameArray={finalweekcontainerClass} data={processed_data} />
        </div>
    )
}