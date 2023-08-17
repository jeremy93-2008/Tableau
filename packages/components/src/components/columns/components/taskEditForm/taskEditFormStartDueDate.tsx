import {
    Button,
    Flex,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverContent,
    PopoverTrigger,
    useDisclosure,
} from '@chakra-ui/react'
import React from 'react'
import { useThemeMode } from 'shared-hooks'

interface ITaskEditFormStartDueDateProps {
    startDate: Date | null
    endDate: Date | null
    onChangeStartDate?: (date: Date | null) => void
    onChangeEndDate?: (date: Date | null) => void
}

export function TaskEditFormStartDueDate(
    props: ITaskEditFormStartDueDateProps
) {
    const { startDate, endDate, onChangeStartDate, onChangeEndDate } = props
    const { assignedUser: themeAssignedUser } = useThemeMode()

    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <Flex alignItems="center" flexDirection="column">
            <Flex>Start/Due Date</Flex>
            <Popover isLazy isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
                <PopoverTrigger>
                    <Button
                        colorScheme={themeAssignedUser.colorScheme}
                        bgColor="transparent"
                        color={themeAssignedUser.text}
                    >
                        Start/Due Date
                    </Button>
                </PopoverTrigger>
                <PopoverContent>
                    <PopoverArrow />
                    <PopoverBody>Body</PopoverBody>
                </PopoverContent>
            </Popover>
        </Flex>
    )
}
