import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useTableauMutation, useTableauQuery } from 'shared-hooks'
import { Notification as INotification } from '.prisma/client'
import { INotificationEdit } from '../notificationList'
import { useAtom } from 'jotai'
import { BoardAtom } from 'shared-atoms'

interface INotificationQueryProps {
    filterByFn?: (item: INotification) => boolean
}

export function useNotificationQuery(params: INotificationQueryProps) {
    const { filterByFn = () => true } = params
    const [selectedBoard] = useAtom(BoardAtom)

    const { data: session } = useSession()
    const { data, refetch } = useTableauQuery<INotification[]>(
        ['api/notifications/list', { email: session?.user?.email }],
        { enabled: !!session?.user?.email, noLoading: true }
    )

    const { mutateAsync: mutateReadAsync } = useTableauMutation(() => {
        const value: INotificationEdit = {
            notifications:
                data?.map((item) => ({
                    id: item.id,
                })) || [],
            isRead: true,
            isNew: false,
        }
        return axios.post(`api/notifications/edit`, value, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        })
    })

    const { mutateAsync: mutateNewAsync } = useTableauMutation(
        () => {
            const value: INotificationEdit = {
                notifications:
                    data
                        ?.filter((d) => d.isNew)
                        .map((item) => ({
                            id: item.id,
                        })) || [],
                isRead: false,
                isNew: false,
            }
            return axios.post(`api/notifications/edit`, value, {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            })
        },
        { noLoading: true }
    )

    const { mutateAsync: mutateDeleteAsync } = useTableauMutation(
        (variables: ['single' | 'all', INotification?]) => {
            const [type, notificationItem] = variables
            const list =
                type === 'single' && notificationItem
                    ? [notificationItem]
                    : data ?? []
            const value: INotificationEdit = {
                notifications:
                    list?.map((item) => ({
                        id: item.id,
                    })) || [],
            }
            return axios.post(`api/notifications/delete`, value, {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            })
        }
    )

    return {
        notificationList: (data ?? []).filter(filterByFn),
        refetchNotification: refetch,
        markAsRead: mutateReadAsync,
        markAsNew: mutateNewAsync,
        deleteNotification: mutateDeleteAsync,
    }
}
