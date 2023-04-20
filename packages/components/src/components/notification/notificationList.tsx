import { Alert, AlertIcon, Flex } from '@chakra-ui/react'
import { useTableauQuery } from 'shared-hooks'
import { useSession } from 'next-auth/react'
import { Notification } from '@prisma/client'
import { NotificationItem } from './notificationItem'

export function NotificationList() {
    const { data: session } = useSession()
    const { data } = useTableauQuery<Notification[]>(
        ['api/notification/list', { email: session?.user?.email }],
        { enabled: !!session?.user?.email }
    )
    return (
        <Flex flexDirection="column" gap={2}>
            {data &&
                data.map((item) => (
                    <NotificationItem key={item.id} notification={item} />
                ))}
        </Flex>
    )
}
