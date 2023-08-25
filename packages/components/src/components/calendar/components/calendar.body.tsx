import { Flex } from '@chakra-ui/react'
import React from 'react'
import { IUseCalendarReturn } from '../hooks/useCalendar'

interface ICalendarBodyProps {
    calendar: IUseCalendarReturn
    onClickDate?: (date: Date) => void
    onHoverDate?: (date: Date) => void
    selectedDatesRange?: [Date?, Date?]
}

export function CalendarBody(props: ICalendarBodyProps) {
    const { calendar, onClickDate, onHoverDate, selectedDatesRange } = props

    const [
        selectedStartDate = new Date(0, 0, 0),
        selectedEndDate = new Date(0, 0, 0),
    ] = selectedDatesRange ?? []

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
                        const isDaySelected =
                            selectedStartDate.getTime() <= day.date.getTime() &&
                            selectedEndDate.getTime() >= day.date.getTime()
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
