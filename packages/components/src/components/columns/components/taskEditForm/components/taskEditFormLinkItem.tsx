import axios from 'axios'
import { useAtom } from 'jotai'
import { Link as LinkTable } from '@prisma/client'
import {
    Link,
    Flex,
    Image,
    Text,
    Tooltip,
    IconButton,
    useDisclosure,
} from '@chakra-ui/react'
import React, { useCallback, useState, useEffect } from 'react'
import { RiErrorWarningFill } from 'react-icons/ri'
import { BsFillPencilFill, BsTrashFill } from 'react-icons/bs'
import { DeleteModal } from '../../../modal/deleteModal'
import { useTableauMutation } from 'shared-hooks'
import { BoardAtom, RefetchBoardAtom } from 'shared-atoms'
import { useSession } from 'next-auth/react'
import { ILinkFormikValues } from './taskEditForrmLinkField'

type ILinkDeleteFormikValues = {
    boardId: string
    id: string
}

interface ITaskEditFormLinkItemProps {
    link: LinkTable
    onEdit: (link: Omit<Omit<ILinkFormikValues, 'boardId'>, 'taskId'>) => void
}

export function TaskEditFormLinkItem(props: ITaskEditFormLinkItemProps) {
    const { link, onEdit } = props
    const [isValidImage, setValidImage] = useState(true)

    const [selectedBoard] = useAtom(BoardAtom)
    const [refetchBoard] = useAtom(RefetchBoardAtom)

    const { data: session } = useSession()

    const onImageError = useCallback(() => {
        setValidImage(false)
    }, [])

    const [isHover, setIsHover] = useState(false)

    const onMouseEnter = useCallback(() => {
        setIsHover(true)
    }, [])

    const onMouseLeave = useCallback(() => {
        setIsHover(false)
    }, [])

    const onEditModalOpen = useCallback(() => {
        onEdit({
            id: link.id,
            name: link.name,
            url: link.url,
        })
    }, [link, onEdit])

    const {
        isOpen: isDeleteModalOpen,
        onOpen: onDeleteModalOpen,
        onClose: onDeleteModalClose,
    } = useDisclosure()

    const { mutateAsync: mutateDeleteAsync } = useTableauMutation(
        (values: ILinkDeleteFormikValues) => {
            return axios.post(`api/link/delete`, values, {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            })
        }
    )

    const onSubmitDelete = useCallback(() => {
        if (!selectedBoard || !session?.user.email) return
        mutateDeleteAsync({
            id: link.id,
            boardId: selectedBoard.id,
        }).then(() => {
            refetchBoard.fetch()
            onDeleteModalClose()
        })
    }, [
        link,
        mutateDeleteAsync,
        onDeleteModalClose,
        refetchBoard,
        selectedBoard,
        session,
    ])

    useEffect(() => {
        setValidImage(true)
    }, [link.image])

    return (
        <Flex
            display="flex"
            flex={1}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <Flex flex={1} alignItems="center">
                <Link
                    href={link.url}
                    rel="noreferrer"
                    target="_blank"
                    display="flex"
                    flex={1}
                >
                    {isValidImage ? (
                        <Tooltip label={link.url}>
                            <Image
                                width="24px"
                                height="24px"
                                alt={link.name}
                                src={link.image}
                                onError={onImageError}
                                fontSize="8px"
                            />
                        </Tooltip>
                    ) : (
                        <Tooltip label="Favicon image not found">
                            <Flex>
                                <RiErrorWarningFill
                                    color="#FDB6A0"
                                    size="24px"
                                />
                            </Flex>
                        </Tooltip>
                    )}
                    <Text colorScheme="teal" ml={2}>
                        {link.name}
                    </Text>
                </Link>
                <Flex>
                    <Tooltip label="Edit Link Item">
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
                    <Tooltip label="Delete Link Item">
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
                <DeleteModal
                    title="Delete Link Item"
                    isOpen={isDeleteModalOpen}
                    onClose={onDeleteModalClose}
                    onSubmit={onSubmitDelete}
                />
            </Flex>
        </Flex>
    )
}
