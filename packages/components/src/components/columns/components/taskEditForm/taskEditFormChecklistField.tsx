import axios from 'axios'
import { useTableauMutation } from 'shared-hooks'
import {
    Flex,
    IconButton,
    Text,
    Tooltip,
    useDisclosure,
} from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import { TaskEditFormChecklistGroup } from './taskEditFormChecklistGroup'
import React, { useCallback } from 'react'
import { IFullTask } from 'shared-types'
import { SingleInputModal } from '../../modal/singleInputModal'
import { useAtom } from 'jotai'
import { BoardAtom, RefetchBoardAtom } from 'shared-atoms'
import { z } from 'zod'

export type ICheckListGroupCreateFormikValues = {
    boardId: string
    name: string
    taskId: string
}

export type ICheckListGroupEditFormikValues = {
    id: string
    boardId: string
    name?: string
}

export type ICheckListGroupDeleteFormikValues = {
    id: string
    boardId: string
}

interface ITaskEditFormChecklistFieldProps {
    task: IFullTask
}

export function TaskEditFormChecklistField(
    props: ITaskEditFormChecklistFieldProps
) {
    const { task } = props

    const [selectedBoard] = useAtom(BoardAtom)
    const [refetchBoards] = useAtom(RefetchBoardAtom)

    const { isOpen, onOpen, onClose } = useDisclosure()

    const { mutateAsync } = useTableauMutation(
        (values: ICheckListGroupCreateFormikValues) => {
            return axios.post(`api/checklist_group/create`, values, {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            })
        }
    )

    const onAddGroup = useCallback(() => {
        onOpen()
    }, [onOpen])

    const onSubmitAddGroup = useCallback(
        (value: string) => {
            if (!selectedBoard) return
            mutateAsync({
                boardId: selectedBoard?.id,
                name: value,
                taskId: task.id,
            }).then(() => {
                refetchBoards.fetch()
                onClose()
            })
        },
        [mutateAsync, onClose, refetchBoards, selectedBoard, task.id]
    )

    return (
        <Flex pr={3} width="100%" flexDirection="column">
            <Flex>
                <Text fontWeight="medium" mr={2}>
                    Checklists
                </Text>
                <Tooltip label="Add a Checklist group">
                    <IconButton
                        onClick={onAddGroup}
                        aria-label="Add a CheckList group"
                        icon={<AddIcon />}
                        size="xs"
                    />
                </Tooltip>
                <SingleInputModal
                    isOpen={isOpen}
                    onClose={onClose}
                    title={'Add a Checklist Group'}
                    description={'Name'}
                    onSubmit={onSubmitAddGroup}
                    validationValueSchema={z.string().min(3)}
                />
            </Flex>
            <Flex flexDirection="column" mt={2} ml={3}>
                {task.checklistsGroup.map((group) => (
                    <TaskEditFormChecklistGroup
                        key={group.id}
                        checklistGroup={group}
                    />
                ))}
            </Flex>
        </Flex>
    )
}
