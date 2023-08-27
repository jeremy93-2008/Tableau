import { getDateString } from '../taskEditForm/utils/getDateString'
import { Badge, Flex, Text, Tooltip } from '@chakra-ui/react'
import React from 'react'
import { IFullTask } from 'shared-types'
import { FaArrowRight } from 'react-icons/fa'
import { Icon } from '@chakra-ui/icons'

interface ITaskItemStartDueDateProps {
    task: IFullTask
}

export function TaskItemStartDueDate(props: ITaskItemStartDueDateProps) {
    const { task } = props

    const isDateExisting = task.startDate || task.endDate

    return (
        isDateExisting && (
            <Badge
                width="92%"
                my={1}
                bgColor="blue.500"
                borderRadius="5px"
                justifyContent="left"
            >
                <Flex
                    width="100%"
                    justifyContent="center"
                    alignItems="center"
                    my={'2px'}
                >
                    {task.startDate && (
                        <Tooltip label="Start Date">
                            <Text fontSize="xs">
                                {getDateString(new Date(task.startDate))}
                            </Text>
                        </Tooltip>
                    )}
                    {task.endDate && (
                        <>
                            {task.startDate && (
                                <Icon as={FaArrowRight} mx={1} />
                            )}
                            <Tooltip label="Due Date">
                                <Text fontSize="xs">
                                    {getDateString(new Date(task.endDate))}
                                </Text>
                            </Tooltip>
                        </>
                    )}
                </Flex>
            </Badge>
        )
    )
}
