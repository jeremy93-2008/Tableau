import React from 'react'
import { Flex, IconButton, Select, Tooltip } from '@chakra-ui/react'
import { FaCaretLeft, FaCaretRight } from 'react-icons/fa'
import { IUseCalendarReturn } from '../hooks/useCalendar'
import { months } from '../constants/months'
import { years } from '../constants/years'

interface ICalendarHeaderProps {
    calendar: IUseCalendarReturn
    onPrev: () => void
    onNext: () => void
    onSelectedMonth: (e: React.ChangeEvent<HTMLSelectElement>) => void
    onSelectedYear: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

export function CalendarHeader(props: ICalendarHeaderProps) {
    const { onPrev, onNext, onSelectedYear, onSelectedMonth, calendar } = props
    return (
        <Flex justifyContent="space-between" mx={2} mt={1} mb={3}>
            <Tooltip label="Previous Month">
                <Flex alignItems="center" onClick={onPrev}>
                    <IconButton
                        colorScheme="teal"
                        variant="outline"
                        aria-label={'prev'}
                        icon={<FaCaretLeft />}
                    />
                </Flex>
            </Tooltip>

            <Flex justifyContent="center" alignItems="center" fontWeight="500">
                <Select
                    size="sm"
                    color="teal.200"
                    onChange={onSelectedMonth}
                    mx={2}
                    border={0}
                >
                    {months.map((month, index) => (
                        <option
                            key={index}
                            selected={month.name === calendar.month}
                            value={month.name}
                        >
                            {month.name}
                        </option>
                    ))}
                </Select>
                <Select
                    size="sm"
                    color="teal.200"
                    onChange={onSelectedYear}
                    mx={2}
                    border={0}
                    sx={{
                        'padding-right': '0px',
                    }}
                >
                    {years.map((year, index) => (
                        <option
                            key={index}
                            selected={year === calendar.year}
                            value={year}
                        >
                            {year}
                        </option>
                    ))}
                </Select>
            </Flex>
            <Tooltip label="Next Month">
                <Flex alignItems="center" onClick={onNext}>
                    <IconButton
                        colorScheme="teal"
                        variant="outline"
                        aria-label={'next'}
                        icon={<FaCaretRight />}
                    />
                </Flex>
            </Tooltip>
        </Flex>
    )
}
