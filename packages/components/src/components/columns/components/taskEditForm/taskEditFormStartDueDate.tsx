import {
    Button,
    Flex,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverContent,
    PopoverTrigger,
    useDisclosure,
    Text,
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useThemeMode } from 'shared-hooks'
import { Calendar } from '../../../calendar'
import { FaArrowRight } from 'react-icons/fa'
import { Icon } from '@chakra-ui/icons'
import { getDateString } from './utils/getDateString'

interface ITaskEditFormStartDueDateProps {
    startDate?: Date | null
    endDate?: Date | null
    onChangeDate?: (date: [Date?, Date?]) => void
}

export function TaskEditFormStartDueDate(
    props: ITaskEditFormStartDueDateProps
) {
    const { startDate, endDate, onChangeDate } = props

    const [selectedRangeDates, setSelectedRangeDates] = useState<
        [Date?, Date?]
    >([])

    const onClickDate = (date: Date) => {
        if (!startDate || (startDate && endDate)) {
            onChangeDate?.([date, undefined])
            setSelectedRangeDates([date, undefined])
            return
        }
        onChangeDate?.([startDate, date])
        setSelectedRangeDates([startDate, date])
    }

    const onHoverDate = (date: Date) => {
        if (startDate && endDate) return
        if (!startDate) {
            setSelectedRangeDates([date, undefined])
            return
        }
        setSelectedRangeDates([startDate, date])
    }

    useEffect(() => {
        setSelectedRangeDates([startDate ?? undefined, endDate ?? undefined])
    }, [])

    const { text } = useThemeMode()
    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <Flex alignItems="center" flexDirection="column">
            <Flex mb={2}>Start/Due Date</Flex>
            <Popover isLazy isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
                <PopoverTrigger>
                    <Button
                        colorScheme="teal"
                        variant="ghost"
                        color={text.primary}
                        fontWeight={400}
                        size="sm"
                    >
                        <>
                            <Text>
                                <>
                                    {startDate
                                        ? getDateString(startDate)
                                        : 'Start Date'}
                                </>
                            </Text>
                            <Icon as={FaArrowRight} mx={2} />
                            <Text>
                                <>
                                    {endDate
                                        ? getDateString(endDate)
                                        : 'Due Date'}
                                </>
                            </Text>
                        </>
                    </Button>
                </PopoverTrigger>
                <PopoverContent>
                    <PopoverArrow />
                    <PopoverBody>
                        <Calendar
                            date={startDate ?? new Date()}
                            onClickDate={onClickDate}
                            onHoverDate={onHoverDate}
                            selectedDatesRange={selectedRangeDates}
                        />
                    </PopoverBody>
                </PopoverContent>
            </Popover>
        </Flex>
    )
}
