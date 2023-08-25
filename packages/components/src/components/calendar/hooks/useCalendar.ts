interface CalendarProps {
    month: number
    year: number
}

export interface IUseCalendarReturn {
    days: {
        name: string
        date: Date
        isCurrentMonth: boolean
        isToday: boolean
    }[][]
    numberOfDays: number
    firstDay: Date
    lastDay: Date
    month: string
    year: number
}

export function useCalendar(params: CalendarProps) {
    const { month, year } = params
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)

    const numberOfDays = lastDay.getDate()
    const numberOfWeeks = Math.ceil((numberOfDays + firstDay.getDay()) / 7)

    const days = Array.from({ length: numberOfWeeks }, (_, i) => {
        return Array.from({ length: 7 }, (_, j) => {
            const day = i * 7 + j + 1 - firstDay.getDay()
            const date = new Date(year, month, day)

            return {
                name: date.toLocaleString('default', { weekday: 'narrow' }),
                date,
                isCurrentMonth: date.getMonth() === month,
                isToday: date.toDateString() === new Date().toDateString(),
            }
        })
    })

    const monthName = firstDay.toLocaleString('default', { month: 'long' })
    const yearName = firstDay.getFullYear()

    return {
        days,
        numberOfDays,
        firstDay,
        lastDay,
        month: monthName.slice(0, 1).toUpperCase() + monthName.slice(1),
        year: yearName,
    } as IUseCalendarReturn
}
