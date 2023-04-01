import { IFullCheckListGroup } from 'shared-types'
import {
    Button,
    Checkbox,
    CheckboxGroup,
    Flex,
    Text,
    useDisclosure,
} from '@chakra-ui/react'
import React, { useCallback } from 'react'
import { MdChecklist } from 'react-icons/md'
import { AddIcon } from '@chakra-ui/icons'
import axios from 'axios'
import { useTableauMutation } from 'shared-hooks'
import { useSession } from 'next-auth/react'
import { useAtom } from 'jotai'
import { BoardAtom, RefetchBoardAtom } from 'shared-atoms'
import { InputModal } from './modal/inputModal'
import { TaskEditFormChecklistItem } from './taskEditFormChecklistItem'

export type ICheckListCreateFormikValues = {
    boardId: string
    name: string
    email: string
    checklistGroupId: string
}

export type ICheckListEditFormikValues = {
    id: string
    boardId: string
    name?: string
    email?: string
    checked?: boolean
}

export type ICheckListDeleteFormikValues = {
    id: string
    boardId: string
}

interface ITaskEditFormChecklistGroupProps {
    checklistGroup: IFullCheckListGroup
}

export function TaskEditFormChecklistGroup(
    props: ITaskEditFormChecklistGroupProps
) {
    const { checklistGroup } = props

    const [selectedBoard] = useAtom(BoardAtom)
    const [refetchBoard] = useAtom(RefetchBoardAtom)

    const { data: session } = useSession()

    const { isOpen, onOpen, onClose } = useDisclosure()

    const { mutateAsync } = useTableauMutation(
        (values: ICheckListCreateFormikValues) => {
            return axios.post(`api/checklist/create`, values, {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            })
        }
    )

    const onClickAdd = useCallback(() => {
        onOpen()
    }, [onOpen])

    const onSubmitAdd = useCallback(
        (value: string) => {
            if (!selectedBoard || !session?.user.email) return
            mutateAsync({
                boardId: selectedBoard.id,
                checklistGroupId: checklistGroup.id,
                email: session.user.email,
                name: value,
            }).then(() => {
                refetchBoard.fetch()
                onClose()
            })
        },
        [
            checklistGroup.id,
            mutateAsync,
            onClose,
            refetchBoard,
            selectedBoard,
            session,
        ]
    )
    return (
        <Flex flexDirection="column">
            <Flex alignItems="center">
                <MdChecklist size={18} />
                <Text ml={2}>{checklistGroup.name}</Text>
            </Flex>
            <Flex flexDirection="column" alignItems="left" mt={1} mb={2} ml={6}>
                {checklistGroup.checklists.map((checklist) => (
                    <TaskEditFormChecklistItem
                        key={checklist.id}
                        checklist={checklist}
                    />
                ))}
                <Button
                    onClick={onClickAdd}
                    size="xs"
                    width="40%"
                    mt={checklistGroup.checklists.length > 0 ? 2 : 0}
                    leftIcon={<AddIcon />}
                >
                    Add Item
                </Button>
            </Flex>
            <InputModal
                isOpen={isOpen}
                onClose={onClose}
                title={'Add a Checklist Item'}
                description={'Name'}
                onSubmit={onSubmitAdd}
            />
        </Flex>
    )
}
