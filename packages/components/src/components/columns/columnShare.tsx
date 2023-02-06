import React from 'react'
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
import { BsFillPeopleFill } from 'react-icons/bs'
import { useTableauQuery } from 'shared-hooks'
import { useSession } from 'next-auth/react'
import { useAtom } from 'jotai'
import { BoardAtom } from 'shared-atoms'
import { IFullBoardSharing } from 'tableau/types/types'
import { ColumnShareForm } from '../columnShareForm'

export function ColumnShare() {
    const { data: session } = useSession()
    const [selectedBoard] = useAtom(BoardAtom)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { data: boardsSharedUser } = useTableauQuery<IFullBoardSharing[]>(
        ['api/share/list', { boardId: selectedBoard?.id }],
        {
            enabled: !!session,
            refetchOnWindowFocus: false,
        }
    )
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
                leftIcon={<BsFillPeopleFill />}
                ml={3}
            >
                Share
            </Button>
            <Modal size="2xl" isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Share {selectedBoard?.name}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <ColumnShareForm
                            selectedBoard={selectedBoard!}
                            boardsSharedUser={boardsSharedUser!}
                        />
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}
