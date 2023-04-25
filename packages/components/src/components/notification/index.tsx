import { ChangeEvent, useCallback, useState } from 'react'
import { BsBellFill, BsCheck2All } from 'react-icons/bs'
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
} from '@chakra-ui/react'
import { NotificationList } from './notificationList'
import { Notification as INotification } from '@prisma/client'

export function Notification() {
    const [filterBy, setFilterBy] = useState<'all' | 'unread'>('unread')

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

    return (
        <Popover isLazy>
            <Flex>
                <Tooltip label="Notifications">
                    <Box>
                        <PopoverTrigger>
                            <IconButton
                                colorScheme="teal"
                                variant="ghost"
                                aria-label={'Notifications'}
                                icon={
                                    <Flex position="relative">
                                        <Avatar
                                            size="xs"
                                            bgColor="transparent"
                                            color="teal.200"
                                            as={BsBellFill}
                                        />
                                        <Flex
                                            position="absolute"
                                            top={-1}
                                            right={-1}
                                            bg="red.500"
                                            height={3}
                                            width={3}
                                            borderRadius="50%"
                                        />
                                    </Flex>
                                }
                            />
                        </PopoverTrigger>
                    </Box>
                </Tooltip>
            </Flex>
            <PopoverContent width={'450px'}>
                <PopoverHeader py={3} px={6}>
                    <Flex alignItems="center" justifyContent="space-between">
                        <Flex alignItems="center">
                            <Text pr={3} fontWeight="medium">
                                Notifications
                            </Text>
                            <Select onChange={onFilterChange} border={0} px={0}>
                                <option
                                    selected={filterBy === 'all'}
                                    value="all"
                                >
                                    All
                                </option>
                                <option
                                    selected={filterBy === 'unread'}
                                    value="unread"
                                >
                                    Unread
                                </option>
                            </Select>
                        </Flex>
                        <Button
                            leftIcon={<BsCheck2All />}
                            size="sm"
                            colorScheme="teal"
                            variant="ghost"
                        >
                            Mark all as read
                        </Button>
                    </Flex>
                </PopoverHeader>
                <PopoverArrow />
                <PopoverBody>
                    <NotificationList filterByFn={filterByFn} />
                </PopoverBody>
            </PopoverContent>
        </Popover>
    )
}
