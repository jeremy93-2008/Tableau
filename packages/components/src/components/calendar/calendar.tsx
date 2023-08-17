import { useCalendar } from './hooks/useCalendar'

export function Calendar() {
    const calendar = useCalendar({ month: 0, year: 2021 })
    console.log(calendar)
    return <div></div>
}
