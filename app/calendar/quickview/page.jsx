"use client"

import { Calendar } from "@/components/ui/calendar";
import { Day, useDayPicker } from "react-day-picker";
import { addDays, startOfISOWeek, startOfWeek } from "date-fns";
import useSWRMutation from "swr/mutation";
import Link from "next/link";

const CALENDAR_URL = "/api/calendar/month";

async function update_calendar_search(url, { arg }) {
    const res = await fetch(`${url}?date=${arg}`)
    let error = undefined
    let res_json = undefined
    if (!res.ok) {
        const errorInfo = await res.json();
        error = new Error(errorInfo);
        error.info = errorInfo;
        error.status = res.status;
        if (res.status === 404) {
            error.message = "No Menu Items found for this date";
        }

        throw error;
    } else {
        res_json = await res.json()
    }
    const return_dict = {}
    res_json.map((item) => {
        if (item?.date) {
            const date = new Date(Date.parse(item.date));
            return_dict[date.toISOString()] = [item.recipeEntry, item.id]
        }
    })
    return { data: return_dict, error: error }
}

export default function page() {
    let {
        data,
        error,
        isMutating,
        trigger
    } = useSWRMutation(`${CALENDAR_URL}`, update_calendar_search, { throwOnError: false });

    if (error) {
        console.log(error)
    }
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    if (!data) {
        trigger(firstDay.toISOString())
    }

    function DayButtonWithInfo(props) {
        let day_data = null
        if (data?.data) {
            if (data.data[props.date.toISOString()]) {
                day_data = data.data[props.date.toISOString()][0]
                console.log(day_data)
            }
        }
        return (
            <div className={'w-24 mb-2 mr-4 p-3 border overflow-scroll rounded-xl border-accent h-40'}>
                <Day {...props}  >

                </Day>
                {day_data &&
                    <Link href={`/recipes/${day_data.id}/`}
                        className={'underline cursor-pointer font-semibold text-primary '}>
                        {day_data.name}
                    </Link>
                }
            </div>
        )
    }

    const handleChange = (e) => {
        trigger(e.toISOString())

    };

    function getWeekdays(
        locale,
        /** The index of the first day of the week (0 - Sunday). */
        weekStartsOn,
        /** Use ISOWeek instead of locale/ */
        ISOWeek
    ) {
        const start = ISOWeek
            ? startOfISOWeek(new Date())
            : startOfWeek(new Date(), { locale, weekStartsOn });

        const days = [];
        for (let i = 0; i < 7; i++) {
            const day = addDays(start, i);
            days.push(day);
        }
        return days;
    }

    function HeadRow() {
        const {
            classNames,
            styles,
            showWeekNumber,
            locale,
            weekStartsOn,
            ISOWeek,
            formatters: { formatWeekdayName },
            labels: { labelWeekday }
        } = useDayPicker();

        const weekdays = getWeekdays(locale, weekStartsOn, ISOWeek);

        return (
            <tr style={styles.head_row} className={classNames.head_row}>
                {showWeekNumber && (
                    <td style={styles.head_cell} className={classNames.head_cell}></td>
                )}
                {weekdays.map((weekday, i) => (
                    <th
                        key={i}
                        scope="col"
                        className={'w-24 text-muted-foreground rounded-md font-normal text-[0.8rem]'}
                        style={styles.head_cell}
                        aria-label={labelWeekday(weekday, { locale })}
                    >
                        {formatWeekdayName(weekday, { locale })}
                    </th>
                ))}
            </tr>
        );
    }

    return (
        <div>
            <Calendar
                mode="single"
                components={{
                    Day: ({ ...props }) => (<DayButtonWithInfo {...props} />),
                    HeadRow: (({ ...props }) => <HeadRow />),
                }}
                onMonthChange={handleChange}
                className="rounded-md border shadow"

            />
            <div className={'mt-10 ml-auto mr-auto text-center block '}>
                <Link className={'bg-accent-foreground rounded-xl p-4 text-accent'} href={'/calendar/'}>Edit</Link>
            </div>
        </div>
    )
}