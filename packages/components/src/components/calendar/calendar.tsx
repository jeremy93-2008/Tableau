import React, { useState } from 'react'
import { useCalendar } from './hooks/useCalendar'
import { Flex } from '@chakra-ui/react'
import { months } from './constants/months'
import { minYear, maxYear } from './constants/years'
import { CalendarHeader } from './components/calendar.header'
import { CalendarBody } from './components/calendar.body'

interface ICalendarProps {
    date: Date
    onClickDate?: (date: Date) => void
    onHoverDate?: (date: Date) => void
    selectedDatesRange?: [Date?, Date?]
}

export function Calendar(props: ICalendarProps) {
    const { date, selectedDatesRange, onClickDate, onHoverDate } = props
    const [month, setMonth] = useState(date.getMonth())
    const [year, setYear] = useState(date.getFullYear())

    const calendar = useCalendar({ month, year })

    const onPrev = () => {
        if (year - 1 < minYear) return
        if (month < 1) {
            setMonth(11)
            return setYear(year - 1)
        }
        setMonth(month - 1)
    }

    const onNext = () => {
        if (year + 1 > maxYear) return
        if (month > 10) {
            setMonth(0)
            return setYear(year + 1)
        }
        setMonth(month + 1)
    }

    const onSelectedMonth = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setMonth(months.findIndex((month) => month.name === e.target.value))
    }

    const onSelectedYear = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setYear(parseInt(e.target.value))
    }

    return (
        <Flex flexDirection="column">
            <CalendarHeader
                calendar={calendar}
                onPrev={onPrev}
                onSelectedMonth={onSelectedMonth}
                onSelectedYear={onSelectedYear}
                onNext={onNext}
            />
            <CalendarBody
                calendar={calendar}
                onClickDate={onClickDate}
                onHoverDate={onHoverDate}
                selectedDatesRange={selectedDatesRange}
            />
        </Flex>
    )
}
