import axios from 'axios'
import {
    Checkbox,
    Flex,
    IconButton,
    Text,
    Tooltip,
    useDisclosure,
} from '@chakra-ui/react'
import React, { useCallback } from 'react'
import { useAtom } from 'jotai'
import { useSession } from 'next-auth/react'
import { useTableauMutation } from 'shared-hooks'
import { Checklist } from '@prisma/client'
import {
    ICheckListDeleteFormikValues,
    ICheckListEditFormikValues,
} from './taskEditFormChecklistGroup'
import { BoardAtom, RefetchBoardAtom } from 'shared-atoms'
import { SingleInputModal } from '../../../modal/singleInputModal'

import { BsFillPencilFill, BsTrashFill } from 'react-icons/bs'
import { DeleteModal } from '../../../modal/deleteModal'
import { z } from 'zod'

interface ITaskEditFormChecklistItemProps {
    checklist: Checklist
}

export function TaskEditFormChecklistItem(
    props: ITaskEditFormChecklistItemProps
) {
    const { checklist } = props

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
        isOpen: isDeleteModalOpen,
        onOpen: onDeleteModalOpen,
        onClose: onDeleteModalClose,
    } = useDisclosure()

    const { mutateAsync: mutateEditAsync } = useTableauMutation(
        (values: ICheckListEditFormikValues) => {
            return axios.post(`api/checklist/edit`, values, {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            })
        }
    )

    const { mutateAsync: mutateDeleteAsync } = useTableauMutation(
        (values: ICheckListDeleteFormikValues) => {
            return axios.post(`api/checklist/delete`, values, {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            })
        }
    )

    const onCheck = useCallback(() => {
        if (!selectedBoard || !session?.user.email) return
        mutateEditAsync({
            id: checklist.id,
            boardId: selectedBoard.id,
            checked: !checklist.checked,
        }).then(() => {
            refetchBoard.fetch()
        })
    }, [checklist, mutateEditAsync, refetchBoard, selectedBoard, session])

    const onSubmitEdit = useCallback(
        (value: string) => {
            if (!selectedBoard || !session?.user.email) return
            mutateEditAsync({
                id: checklist.id,
                boardId: selectedBoard.id,
                name: value,
            }).then(() => {
                refetchBoard.fetch()
                onClose()
            })
        },
        [
            checklist,
            mutateEditAsync,
            onClose,
            refetchBoard,
            selectedBoard,
            session,
        ]
    )

    const onSubmitDelete = useCallback(() => {
        if (!selectedBoard || !session?.user.email) return
        mutateDeleteAsync({
            id: checklist.id,
            boardId: selectedBoard.id,
        }).then(() => {
            refetchBoard.fetch()
            onDeleteModalClose()
        })
    }, [
        checklist,
        mutateDeleteAsync,
        onDeleteModalClose,
        refetchBoard,
        selectedBoard,
        session,
    ])

    return (
        <Flex
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            flex={1}
            width="100%"
            justifyContent="space-between"
            alignItems={'center'}
            cursor="pointer"
        >
            <Checkbox
                display={'flex'}
                flex={1}
                onChange={onCheck}
                colorScheme="teal"
                isChecked={checklist.checked}
            >
                <Text ml={2} as={checklist.checked ? 's' : 'span'}>
                    {checklist.name}
                </Text>
            </Checkbox>
            <Tooltip label="Edit Checklist Item">
                <IconButton
                    visibility={isHover ? 'visible' : 'hidden'}
                    aria-label={'Edit Checklist Item'}
                    icon={<BsFillPencilFill />}
                    size="xs"
                    w={'22px'}
                    h={'22px'}
                    variant={'ghost'}
                    onClick={onOpen}
                />
            </Tooltip>
            <Tooltip label="Delete Checklist Item">
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

            <SingleInputModal
                isOpen={isOpen}
                onClose={onClose}
                title={'Add a Checklist Item'}
                description={'Name'}
                onSubmit={onSubmitEdit}
                defaultValue={checklist.name}
                validationValueSchema={z.string().min(3)}
            />
            <DeleteModal
                title="Delete Chwcklist Item"
                isOpen={isDeleteModalOpen}
                onClose={onDeleteModalClose}
                onSubmit={onSubmitDelete}
            />
        </Flex>
    )
}
