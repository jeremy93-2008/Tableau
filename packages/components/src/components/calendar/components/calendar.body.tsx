import { Flex } from '@chakra-ui/react'
import React, { useCallback } from 'react'
import { IUseCalendarReturn } from '../hooks/useCalendar'

interface ICalendarBodyProps {
    calendar: IUseCalendarReturn
    onClickDate?: (date: Date) => void
    onHoverDate?: (date: Date) => void
    selectedDatesRange?: [Date?, Date?]
}

export function CalendarBody(props: ICalendarBodyProps) {
    const { calendar, onClickDate, onHoverDate, selectedDatesRange } = props

    const [selectedStartDate, selectedEndDate] = selectedDatesRange ?? []

    const getIsDaySelected = useCallback(
        (date: Date) => {
            if (!selectedStartDate && !selectedEndDate) return false
            if (
                (!selectedStartDate && selectedEndDate) ||
                (selectedStartDate &&
                    selectedEndDate &&
                    selectedStartDate.getTime() > selectedEndDate.getTime())
            )
                return selectedEndDate.getTime() === date.getTime()
            return (
                selectedStartDate &&
                selectedEndDate &&
                selectedStartDate.getTime() <= date.getTime() &&
                selectedEndDate.getTime() >= date.getTime()
            )
        },
        [selectedStartDate, selectedEndDate]
    )

    return (
        <Flex
            width="100%"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
        >
            <Flex>
                {calendar.days[0].map((day, index) => (
                    <Flex
                        width="32px"
                        height="32px"
                        justifyContent="center"
                        key={index}
                    >
                        {day.name}
                    </Flex>
                ))}
            </Flex>
            {calendar.days.map((day, index) => (
                <Flex key={index}>
                    {day.map((day, index) => {
                        const isDaySelected = getIsDaySelected(day.date)
                        return (
                            <Flex
                                onClick={() => onClickDate?.(day.date)}
                                onMouseEnter={() => onHoverDate?.(day.date)}
                                width="32px"
                                height="32px"
                                justifyContent="center"
                                key={index}
                                sx={
                                    day.isToday && !isDaySelected
                                        ? {
                                              '&': {
                                                  bgColor: 'teal.500',
                                                  color: 'black',
                                                  borderRadius: '100%',
                                                  cursor: 'pointer',
                                              },
                                          }
                                        : isDaySelected
                                        ? {
                                              '&': {
                                                  bgColor: 'teal.400',
                                                  borderRadius: '5px',
                                                  color: 'white',
                                                  cursor: 'pointer',
                                              },
                                          }
                                        : {}
                                }
                                _hover={{
                                    bgColor: 'teal.500',
                                    color: 'white',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                }}
                            >
                                <Flex
                                    color={
                                        day.isCurrentMonth
                                            ? 'white'
                                            : isDaySelected
                                            ? 'teal.200'
                                            : 'gray'
                                    }
                                    alignItems="center"
                                >
                                    {day.date.toLocaleString('default', {
                                        day: 'numeric',
                                    })}
                                </Flex>
                            </Flex>
                        )
                    })}
                </Flex>
            ))}
        </Flex>
    )
}
