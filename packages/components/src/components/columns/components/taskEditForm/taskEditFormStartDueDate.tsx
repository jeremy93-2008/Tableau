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
    Divider,
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useToast } from '@chakra-ui/react'
import { Icon } from '@chakra-ui/icons'
import { useThemeMode } from 'shared-hooks'
import { FaArrowRight } from 'react-icons/fa'
import { getDateString } from './utils/getDateString'
import { Calendar } from '../../../calendar'

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
    const { isOpen, onOpen, onClose } = useDisclosure()

    const onClickDate = (date: Date) => {
        if (startDate?.getTime() === date.getTime()) {
            onChangeDate?.([undefined, endDate ?? undefined])
            setSelectedRangeDates([undefined, endDate ?? undefined])
            return
        }

        if (endDate?.getTime() === date.getTime()) {
            onChangeDate?.([startDate ?? undefined, undefined])
            setSelectedRangeDates([startDate ?? undefined, undefined])
            return
        }

        if (!endDate || (startDate && endDate)) {
            onChangeDate?.([undefined, date])
            setSelectedRangeDates([undefined, date])
            return
        }
        if (date.getTime() > endDate.getTime()) {
            onChangeDate?.([undefined, date])
            setSelectedRangeDates([undefined, date])
            return
        }
        onChangeDate?.([date, endDate])
        setSelectedRangeDates([date, endDate])
        onClose()
    }

    const onHoverDate = (date: Date) => {
        if (startDate && endDate) return
        if (!endDate) {
            setSelectedRangeDates([undefined, date])
            return
        }
        setSelectedRangeDates([date, endDate])
    }

    const onClearAll = () => {
        setSelectedRangeDates([undefined, undefined])
        onChangeDate?.([undefined, undefined])
        onClose()
    }

    const { text } = useThemeMode()

    useEffect(() => {
        setSelectedRangeDates([startDate ?? undefined, endDate ?? undefined])
    }, [isOpen, startDate, endDate])

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
                            <Text width="75px">
                                <>
                                    {startDate
                                        ? getDateString(startDate)
                                        : 'Start Date'}
                                </>
                            </Text>
                            <Icon as={FaArrowRight} mx={2} />
                            <Text width="75px">
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
                            date={startDate ?? endDate ?? new Date()}
                            onClickDate={onClickDate}
                            onHoverDate={onHoverDate}
                            selectedDatesRange={selectedRangeDates}
                            Footer={
                                <Flex
                                    flexDirection="column"
                                    my={1}
                                    width="100%"
                                    justifyContent="flex-end"
                                >
                                    <Divider />
                                    <Flex mt={3} justifyContent="flex-end">
                                        <Button
                                            colorScheme="teal"
                                            variant="outline"
                                            size="sm"
                                            onClick={onClearAll}
                                        >
                                            Clear All
                                        </Button>
                                    </Flex>
                                </Flex>
                            }
                        />
                    </PopoverBody>
                </PopoverContent>
            </Popover>
        </Flex>
    )
}
