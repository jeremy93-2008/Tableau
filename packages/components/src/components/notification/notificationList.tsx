import { useEffect } from 'react'
import axios from 'axios'
import { useAtom } from 'jotai'
import { BsBellSlashFill } from 'react-icons/bs'
import { Flex } from '@chakra-ui/react'
import { useSession } from 'next-auth/react'
import { Notification } from '@prisma/client'
import { BoardAtom } from 'shared-atoms'
import { useTableauMutation, useTableauQuery } from 'shared-hooks'
import { NotificationItem } from './notificationItem'
import { Icon } from '@chakra-ui/icons'

type INotificationEdit = {
    boardId: string
    notifications: INotificationEditValues[]
    isRead?: boolean
    isNew?: boolean
}

type INotificationEditValues = {
    id: string
}

interface INotificationListProps {
    filterByFn: (item: Notification) => boolean
}

export function NotificationList(props: INotificationListProps) {
    const { filterByFn } = props
    const [selectedBoard] = useAtom(BoardAtom)
    const { data: session } = useSession()
    const { data, refetch } = useTableauQuery<Notification[]>(
        ['api/notification/list', { email: session?.user?.email }],
        { enabled: !!session?.user?.email, noLoading: true }
    )

    const { mutateAsync } = useTableauMutation(() => {
        const value: INotificationEdit = {
            boardId: selectedBoard?.id || '',
            notifications:
                data?.map((item) => ({
                    id: item.id,
                })) || [],
            isRead: true,
            isNew: false,
        }
        return axios.post(`api/notification/edit`, value, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        })
    })

    useEffect(() => {
        const clearTimeoutId = window.setTimeout(async () => {
            if (data && data.every((item) => item.isRead)) return
            await mutateAsync(null)
            await refetch()
        }, 2000)

        return () => {
            clearTimeout(clearTimeoutId)
        }
    }, [data, mutateAsync, refetch])

    const notificationFiltered = data?.filter(filterByFn)

    return (
        <Flex flexDirection="column" gap={2}>
            {notificationFiltered &&
                notificationFiltered.map((item) => (
                    <NotificationItem key={item.id} notification={item} />
                ))}
            {notificationFiltered && notificationFiltered.length === 0 && (
                <Flex px={6} py={8} flexDirection="column" alignItems="center">
                    <Icon as={BsBellSlashFill} mb={2} fontSize="3xl" />
                    <Flex
                        px={8}
                        fontSize="14px"
                        justifyContent="center"
                        textAlign="center"
                    >
                        Everything is up to date. You have no new notifications.
                    </Flex>
                </Flex>
            )}
        </Flex>
    )
}
