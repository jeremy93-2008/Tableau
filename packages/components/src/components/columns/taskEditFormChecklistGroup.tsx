import { IFullCheckListGroup } from 'shared-types'
import {
    Button,
    Flex,
    IconButton,
    Text,
    Tooltip,
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
import { z } from 'zod'
import { BsFillPencilFill, BsTrashFill } from 'react-icons/bs'
import { DeleteModal } from './modal/deleteModal'
import {
    ICheckListGroupDeleteFormikValues,
    ICheckListGroupEditFormikValues,
} from './taskEditFormChecklistField'

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

    const [isHover, setIsHover] = React.useState(false)

    const onMouseEnter = useCallback(() => {
        setIsHover(true)
    }, [])

    const onMouseLeave = useCallback(() => {
        setIsHover(false)
    }, [])

    const { isOpen, onOpen, onClose } = useDisclosure()

    const {
        isOpen: isEditModalOpen,
        onOpen: onEditModalOpen,
        onClose: onEditModalClose,
    } = useDisclosure()

    const {
        isOpen: isDeleteModalOpen,
        onOpen: onDeleteModalOpen,
        onClose: onDeleteModalClose,
    } = useDisclosure()

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

    const { mutateAsync: mutateEditAsync } = useTableauMutation(
        (values: ICheckListGroupEditFormikValues) => {
            return axios.post(`api/checklist_group/edit`, values, {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            })
        }
    )

    const { mutateAsync: mutateDeleteAsync } = useTableauMutation(
        (values: ICheckListGroupDeleteFormikValues) => {
            return axios.post(`api/checklist_group/delete`, values, {
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
        (values: string[]) => {
            if (!selectedBoard || !session?.user.email) return
            const [value] = values
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

    const onSubmitEdit = useCallback(
        (values: string[]) => {
            if (!selectedBoard || !session?.user.email) return
            const [value] = values
            mutateEditAsync({
                boardId: selectedBoard.id,
                id: checklistGroup.id,
                name: value,
            }).then(() => {
                refetchBoard.fetch()
                onEditModalClose()
            })
        },
        [
            checklistGroup,
            mutateEditAsync,
            onEditModalClose,
            refetchBoard,
            selectedBoard,
            session,
        ]
    )

    const onSubmitDelete = useCallback(() => {
        if (!selectedBoard || !session?.user.email) return
        mutateDeleteAsync({
            boardId: selectedBoard.id,
            id: checklistGroup.id,
        }).then(() => {
            refetchBoard.fetch()
            onDeleteModalClose()
        })
    }, [
        checklistGroup,
        mutateDeleteAsync,
        onDeleteModalClose,
        refetchBoard,
        selectedBoard,
        session,
    ])

    return (
        <Flex flexDirection="column">
            <Flex
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                alignItems="center"
            >
                <MdChecklist size={18} />
                <Text display={'flex'} flex={1} ml={2}>
                    {checklistGroup.name}
                </Text>
                <Tooltip label="Edit Checklist Group">
                    <IconButton
                        visibility={isHover ? 'visible' : 'hidden'}
                        aria-label={'Edit Checklist Item'}
                        icon={<BsFillPencilFill />}
                        size="xs"
                        w={'22px'}
                        h={'22px'}
                        variant={'ghost'}
                        onClick={onEditModalOpen}
                    />
                </Tooltip>
                <Tooltip label="Delete Checklist Group">
                    <IconButton
                        visibility={isHover ? 'visible' : 'hidden'}
                        aria-label={'Delete Checklist Item'}
                        icon={<BsTrashFill />}
                        size="xs"
                        w={'22px'}
                        h={'22px'}
                        variant={'ghost'}
                        onClick={onDeleteModalOpen}
                        _hover={{ bgColor: 'red.500' }}
                    />
                </Tooltip>
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
                description={['Name']}
                onSubmit={onSubmitAdd}
                validationValueSchema={[z.string().min(3)]}
            />
            <InputModal
                isOpen={isEditModalOpen}
                onClose={onEditModalClose}
                title={'Edit a Checklist Group'}
                description={['Name']}
                defaultValue={checklistGroup.name}
                onSubmit={onSubmitEdit}
                validationValueSchema={[z.string().min(3)]}
            />
            <DeleteModal
                title="Delete Checklist Group"
                isOpen={isDeleteModalOpen}
                onClose={onDeleteModalClose}
                onSubmit={onSubmitDelete}
            />
        </Flex>
    )
}
