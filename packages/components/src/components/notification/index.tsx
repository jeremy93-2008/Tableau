import { ChangeEvent, useCallback, useState } from 'react'
import { BsBellFill, BsCheck2All, BsTrashFill } from 'react-icons/bs'
import {
    Avatar,
    Box,
    Flex,
    Text,
    IconButton,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverContent,
    PopoverHeader,
    PopoverTrigger,
    Tooltip,
    Button,
    Select,
    useToast,
} from '@chakra-ui/react'
import { NotificationList } from './notificationList'
import { Notification as INotification } from '@prisma/client'
import { useNotificationQuery } from './hooks/useNotificationQuery'
import { useSession } from 'next-auth/react'
import { useThemeMode } from 'shared-hooks'
import { useNotificationToast } from './hooks/useNotificationToast'

export function Notification() {
    const { data: session, status } = useSession()

    const { bg, text } = useThemeMode()

    const [filterBy, setFilterBy] = useState<'all' | 'unread'>('unread')
    const [hasUnreadNotification, setHasUnreadNotification] = useState(true)

    const filterByFn = useCallback(
        (notification: INotification) => {
            if (filterBy === 'all') return true
            return !notification.isRead
        },
        [filterBy]
    )

    const onFilterChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
        setFilterBy(e.target.value as 'all' | 'unread')
    }, [])

    const onHasUnreadNotificationChange = useCallback(
        (newHasUnreadNotification: boolean) => {
            if (newHasUnreadNotification === hasUnreadNotification) return
            setHasUnreadNotification(newHasUnreadNotification)
        },
        [hasUnreadNotification]
    )

    useNotificationToast()
    const { markAsRead, deleteNotification, refetchNotification } =
        useNotificationQuery({})

    return (
        <Popover>
            <Flex>
                <Tooltip label="Notifications">
                    <Box>
                        <PopoverTrigger>
                            <IconButton
                                colorScheme="teal"
                                variant="ghost"
                                aria-label="Notifications"
                                isDisabled={status !== 'authenticated'}
                                icon={
                                    <Flex position="relative">
                                        <Avatar
                                            size="xs"
                                            bgColor="transparent"
                                            color="teal.200"
                                            as={BsBellFill}
                                        />
                                        {hasUnreadNotification && (
                                            <Flex
                                                position="absolute"
                                                top={-1}
                                                right={-1}
                                                bg="red.500"
                                                height={3}
                                                width={3}
                                                borderRadius="50%"
                                            />
                                        )}
                                    </Flex>
                                }
                            />
                        </PopoverTrigger>
                    </Box>
                </Tooltip>
            </Flex>
            <PopoverContent width={'450px'} bg={bg.modal} color={text.primary}>
                <PopoverHeader py={3} px={6}>
                    <Flex alignItems="center" justifyContent="space-between">
                        <Flex alignItems="center">
                            <Text pr={3} fontWeight="medium">
                                Notifications
                            </Text>
                            <Select
                                onChange={onFilterChange}
                                defaultValue={filterBy}
                                border={0}
                                px={0}
                            >
                                <option value="all">All</option>
                                <option value="unread">Unread</option>
                            </Select>
                        </Flex>
                        {filterBy === 'unread' && (
                            <Button
                                onClick={() => {
                                    markAsRead('allUnread').then(() => {
                                        refetchNotification().then()
                                    })
                                }}
                                leftIcon={<BsCheck2All />}
                                size="sm"
                                colorScheme="teal"
                                variant="ghost"
                            >
                                Mark all as read
                            </Button>
                        )}
                        {filterBy === 'all' && (
                            <Button
                                onClick={() => {
                                    deleteNotification(['all']).then(() => {
                                        refetchNotification().then()
                                    })
                                }}
                                leftIcon={<BsTrashFill />}
                                size="sm"
                                colorScheme="red"
                                variant="ghost"
                            >
                                Delete all
                            </Button>
                        )}
                    </Flex>
                </PopoverHeader>
                <PopoverArrow />
                <PopoverBody
                    minHeight="160px"
                    maxHeight="280px"
                    overflowY="auto"
                >
                    <NotificationList
                        filterBy={filterBy}
                        filterByFn={filterByFn}
                        onHasUnreadNotificationChange={
                            onHasUnreadNotificationChange
                        }
                    />
                </PopoverBody>
            </PopoverContent>
        </Popover>
    )
}
