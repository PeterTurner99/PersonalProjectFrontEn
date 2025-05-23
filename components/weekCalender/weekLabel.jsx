

export function WeekLabel({data, className}) {
    const hours = [...Array(24).keys()];
    const dayMapping = {
        0: 'Monday',
        1: 'Tuesday',
        2: 'Wednesday',
        3: 'Thursday',
        4: 'Friday',
        5: 'Saturday',
        6: 'Sunday',

    }
    console.log(data)
    const daysIso = Object.keys(data)
    const days = []
    daysIso.map((day, index) => {
        const dateObj = new Date(day)
        console.log(dateObj.getDate())
        days.push(dateObj.getDate())
    })
    console.log(days)
    return (
        <div className='weekLabel absolute'>
            <div /* horizontal at top */ className="dayLabel ml-24 flex ">
                {days.map((day, index) => (
                    <div key={`day-${day}`}>
                        <p className="bg-accent p-4 rounded-xl m-4 w-32 h-24 border-accent-foreground border ">{day} : {dayMapping[day % 7]}</p>
                    </div>
                ))}
            </div>
            <div /*  left  */   className="hourLabels flex flex-col w-16">

                {hours.map((hour, index) => (
                    <div key={`hour-div-${index}`}>
                        <p className="bg-accent p-4 rounded-xl m-2 border-accent-foreground border ">{hour}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}