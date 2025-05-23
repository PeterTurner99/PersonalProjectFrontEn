"use client"
import { WeekCalendar } from "@/components/weekCalender/weekCalendar"
import useSWR from "swr";


// 24 hours vertically horizontal week
// same hour stack horizontally
const WEEK_URL = '/api/calendar/recurring'
const fetcher = async (url) => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = new Error("Something went wrong");
    error.info = await res.json();
    error.status = res.status;
    throw error;
  }
  return res.json();
};
export default function Page() {
    const {data, error, isLoading} = useSWR(WEEK_URL, fetcher);
    const startDate = new Date()

    if (isLoading){
        return(
            <div> <p>Loading</p></div>
        )
    }
    return (
        <div>
            {data &&
            <WeekCalendar data={data} startDate={startDate}></WeekCalendar>
            }
        </div>
    )   
}