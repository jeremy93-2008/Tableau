import React from 'react'
import {
    Avatar,
    Box,
    Button,
    Flex,
    IconButton,
    Image,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverContent,
    PopoverTrigger,
    Tooltip,
    useDisclosure,
} from '@chakra-ui/react'
import { AiOutlinePlus } from 'react-icons/ai'
import { useAtom } from 'jotai'
import { BoardAtom } from 'shared-atoms'
import { IFullTaskAssignedUser } from 'shared-types/src/types'
import { FaUserCircle } from 'react-icons/fa'
import { useTableauQuery } from 'shared-hooks'
import { IFullBoardSharing } from './columnShare'

interface ITaskEditFormAssignedUserProps {
    assignedUsers?: IFullTaskAssignedUser[]
    setAssignedUser: (assignedUserId: string | null) => void
}

export const LIMIT_USER_VISIBLE = 5

export function TaskEditFormAssignedUser(
    props: ITaskEditFormAssignedUserProps
) {
    const { assignedUsers, setAssignedUser } = props
    const [selectedBoard] = useAtom(BoardAtom)

    const { data } = useTableauQuery<IFullBoardSharing[]>(
        ['api/share/list', { boardId: selectedBoard?.id }],
        {
            noLoading: true,
        }
    )

    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <Flex alignItems="center">
            {assignedUsers?.map((assignedUser, idx, array) => {
                if (idx >= LIMIT_USER_VISIBLE) return <></>
                if (idx === LIMIT_USER_VISIBLE - 1)
                    return (
                        <Tooltip
                            key={assignedUser.id}
                            label={
                                'More assigned users: ' +
                                array
                                    .slice(LIMIT_USER_VISIBLE - 1)
                                    .map((au) => au.User.name)
                                    .join(', ')
                            }
                        >
                            <Flex
                                padding="8px 10px"
                                color="rgba(255,255,255,0.6)"
                                backgroundColor="gray.800"
                                borderRadius={50}
                            >
                                +{array.length + 1 - LIMIT_USER_VISIBLE}
                            </Flex>
                        </Tooltip>
                    )
                return (
                    <Tooltip
                        key={assignedUser.id}
                        label={assignedUser.User.name}
                    >
                        <Avatar
                            size={'sm'}
                            icon={
                                <Image
                                    alt={assignedUser.User.name ?? ''}
                                    src={assignedUser.User.image ?? ''}
                                    borderRadius={50}
                                />
                            }
                            marginRight={
                                array.length - 1 < LIMIT_USER_VISIBLE &&
                                idx === array.length - 1
                                    ? 0
                                    : -3
                            }
                            _hover={{
                                marginRight: 0,
                            }}
                        />
                    </Tooltip>
                )
            })}
            <Popover>
                <Tooltip label="Add an Assigned User">
                    <Box>
                        <PopoverTrigger>
                            <IconButton
                                aria-label="add an assigned user"
                                icon={<AiOutlinePlus />}
                                backgroundColor="gray.600"
                                borderRadius={50}
                                marginLeft={1}
                                _active={{
                                    backgroundColor: 'gray.800',
                                }}
                            />
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
                                            setAssignedUser(
                                                boardSharing.user.id
                                            )
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
        </Flex>
    )
}
