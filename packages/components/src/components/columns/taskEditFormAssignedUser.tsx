import React, { useMemo } from 'react'
import {
    Avatar,
    Box,
    Button,
    Flex,
    Image,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverContent,
    PopoverTrigger,
    Stack,
    Tooltip,
    useDisclosure,
} from '@chakra-ui/react'
import { FaUserAlt, FaUserCircle } from 'react-icons/fa'
import { useTableauQuery } from 'shared-hooks'
import { useAtom } from 'jotai'
import { BoardAtom } from 'shared-atoms'
import { IFullBoardSharing } from './columnShare'

interface ITaskEditFormAssignedUserProps {
    assignedUserId?: string
    setAssignedUser: (assignedUserId: string | null) => void
}

export function TaskEditFormAssignedUser(
    props: ITaskEditFormAssignedUserProps
) {
    const { assignedUserId, setAssignedUser } = props
    const [selectedBoard] = useAtom(BoardAtom)

    const { data } = useTableauQuery<IFullBoardSharing[]>(
        ['api/share/list', { boardId: selectedBoard?.id }],
        {
            noLoading: true,
        }
    )

    const assignedUser = useMemo(() => {
        if (!data || !assignedUserId) return null
        return data.find(
            (boardSharingUser) => boardSharingUser.user.id === assignedUserId
        )?.user
    }, [data, assignedUserId])

    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
        <Popover isLazy isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
            <Tooltip label={'Assign User to this Task'}>
                <Box>
                    <PopoverTrigger>
                        <Button
                            size="sm"
                            aria-label="Assign User to this Task"
                            leftIcon={
                                assignedUser ? (
                                    <Avatar
                                        name={assignedUser.name!}
                                        src={assignedUser.image!}
                                        size="xs"
                                    />
                                ) : (
                                    <FaUserAlt size={10} />
                                )
                            }
                        >
                            {!assignedUser && 'Not Assigned'}
                            {assignedUser && assignedUser.name}
                        </Button>
                    </PopoverTrigger>
                </Box>
            </Tooltip>
            <PopoverContent
                width={220}
                maxHeight={280}
                overflowY="auto"
                onWheel={(evt) => evt.stopPropagation()}
                zIndex="popover"
                p={1}
            >
                <PopoverArrow />
                <PopoverBody>
                    <Flex flexDirection="column" color="white">
                        <Button
                            onClick={() => {
                                setAssignedUser(null)
                                onClose()
                            }}
                            colorScheme="teal"
                            variant="ghost"
                            leftIcon={<FaUserCircle size={32} />}
                            justifyContent="flex-start"
                            mb={2}
                        >
                            Not Assigned
                        </Button>
                        {data &&
                            data.map((boardSharing) => (
                                <Button
                                    key={boardSharing.id}
                                    onClick={() => {
                                        setAssignedUser(boardSharing.user.id)
                                        onClose()
                                    }}
                                    colorScheme="teal"
                                    variant="ghost"
                                    leftIcon={
                                        <Avatar
                                            name={boardSharing.user.name!}
                                            src={boardSharing.user.image!}
                                            size="sm"
                                        />
                                    }
                                    justifyContent="flex-start"
                                    mb={2}
                                >
                                    {boardSharing.user.name}
                                </Button>
                            ))}
                    </Flex>
                </PopoverBody>
            </PopoverContent>
        </Popover>
    )
}
