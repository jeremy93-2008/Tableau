import { useEffect, useMemo } from 'react'
import { BsBellSlashFill } from 'react-icons/bs'
import { Flex } from '@chakra-ui/react'
import { Notification } from '@prisma/client'
import { NotificationItem } from './notificationItem'
import { Icon } from '@chakra-ui/icons'
import { useNotificationQuery } from './hooks/useNotificationQuery'

export type INotificationEdit = {
    notifications: INotificationEditValues[]
    isRead?: boolean
    isNew?: boolean
}

type INotificationEditValues = {
    id: string
}

interface INotificationListProps {
    filterBy: 'all' | 'unread'
    filterByFn: (item: Notification) => boolean
    onHasUnreadNotificationChange: (hasUnreadNotification: boolean) => void
}

export function NotificationList(props: INotificationListProps) {
    const { filterBy, filterByFn, onHasUnreadNotificationChange } = props

    const { notificationList } = useNotificationQuery({ filterByFn })

    useEffect(() => {
        if (notificationList && notificationList.every((item) => item.isRead))
            return onHasUnreadNotificationChange(false)
        onHasUnreadNotificationChange(true)
    }, [notificationList, onHasUnreadNotificationChange])

    return (
        <Flex flexDirection="column" gap={2}>
            {notificationList &&
                notificationList.map((item) => (
                    <NotificationItem key={item.id} notification={item} />
                ))}
            {notificationList && notificationList.length === 0 && (
                <Flex px={6} py={8} flexDirection="column" alignItems="center">
                    <Icon as={BsBellSlashFill} mb={2} fontSize="3xl" />
                    <Flex
                        px={8}
                        fontSize="14px"
                        justifyContent="center"
                        textAlign="center"
                    >
                        {filterBy === 'unread' &&
                            'Everything is up to date. You have no new notifications.'}
                        {filterBy === 'all' && 'You have no notifications.'}
                    </Flex>
                </Flex>
            )}
        </Flex>
    )
}
