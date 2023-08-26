import { Flex, IconButton, Tooltip } from '@chakra-ui/react'
import { BsFillPencilFill } from 'react-icons/bs'
import { TaskEdit } from '../../taskEdit'
import React from 'react'
import { IFullStatus, IFullTask } from 'shared-types'

interface TaskItemEditTaskButtonProps {
    task: IFullTask
    status?: IFullStatus
    readonly?: boolean
    isDisabled?: boolean
    onTaskEdit: () => void
    isHoveringTask: boolean
    taskEdit: {
        isOpen: boolean
        onClose: () => void
    }
}

export function TaskItemEditTaskButton(props: TaskItemEditTaskButtonProps) {
    const {
        task,
        readonly,
        status,
        isDisabled,
        onTaskEdit,
        isHoveringTask,
        taskEdit: { isOpen, onClose },
    } = props

    return (
        <Flex
            mt="-8px"
            mr="-8px"
            justifyContent="right"
            className="board-item-actions"
        >
            {!readonly && (
                <Tooltip label="Edit current Task">
                    {
                        <IconButton
                            data-cy="taskEdit"
                            onClick={() => onTaskEdit()}
                            colorScheme="teal"
                            isDisabled={isDisabled}
                            bgColor="teal.600"
                            _hover={{
                                bgColor: isDisabled ? 'teal.600' : 'teal.500',
                            }}
                            borderRadius="100%"
                            aria-label="Edit current Task"
                            icon={<BsFillPencilFill />}
                            style={{
                                opacity: isHoveringTask ? '1' : '0',
                            }}
                        />
                    }
                </Tooltip>
            )}
            {isOpen && (
                <TaskEdit
                    isOpen={isOpen}
                    onClose={onClose}
                    task={task}
                    status={status!}
                />
            )}
        </Flex>
    )
}
