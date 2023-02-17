import React, { useEffect } from 'react'
import {
    Avatar,
    Button,
    Flex,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Tooltip,
    useDisclosure,
} from '@chakra-ui/react'
import { useTableauQuery } from 'shared-hooks'
import { useSession } from 'next-auth/react'
import { useAtom } from 'jotai'
import { BoardAtom } from 'shared-atoms'
import { IFullBoardSharing } from 'tableau/types/types'
import { ColumnShareForm } from './columnShareForm'
import { FaUserPlus } from 'react-icons/fa'
import { LoadingProvider } from '../loadingProvider'

export function ColumnShare() {
    const { data: session } = useSession()
    const [selectedBoard] = useAtom(BoardAtom)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { data: boardsSharedUser, refetch } = useTableauQuery<
        IFullBoardSharing[]
    >(['api/share/list', { boardId: selectedBoard?.id }], {
        enabled: !!session,
        noLoading: true,
    })

    return (
        <>
            {boardsSharedUser && (
                <Flex>
                    {boardsSharedUser.map((boardShared, idx) => {
                        return (
                            <Tooltip
                                key={boardShared.user.id}
                                label={
                                    boardShared.userId === selectedBoard?.userId
                                        ? `${boardShared.user.name} (Owner)`
                                        : `${boardShared.user.name} (${boardShared.user.email})`
                                }
                            >
                                <Avatar
                                    name={boardShared.user.email!}
                                    src={boardShared.user.image!}
                                    size="sm"
                                    zIndex={boardsSharedUser.length - idx}
                                    ml={idx > 0 ? -4 : 0}
                                    _hover={{ ml: 0 }}
                                    cursor="pointer"
                                    border={
                                        boardShared.userId ===
                                        selectedBoard?.userId
                                            ? 'solid 3px teal'
                                            : ''
                                    }
                                />
                            </Tooltip>
                        )
                    })}
                </Flex>
            )}
            <Button
                onClick={() => onOpen()}
                colorScheme="teal"
                variant="outline"
                leftIcon={<FaUserPlus />}
                ml={3}
            >
                Invite
            </Button>
            <Modal size="xl" isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <LoadingProvider loadingKey="sharing">
                        <ModalHeader>
                            Manage Invitations for {selectedBoard?.name}
                        </ModalHeader>
                        <ModalCloseButton />
                        <ModalBody pb={6}>
                            <ColumnShareForm
                                selectedBoard={selectedBoard!}
                                boardsSharedUser={boardsSharedUser!}
                                refetchSharedBoard={refetch}
                            />
                        </ModalBody>
                    </LoadingProvider>
                </ModalContent>
            </Modal>
        </>
    )
}
