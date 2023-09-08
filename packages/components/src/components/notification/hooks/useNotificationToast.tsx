import { useToast } from '@chakra-ui/react'
import { useNotificationQuery } from './useNotificationQuery'
import { useEffect } from 'react'
import ReactMarkdown from 'react-markdown'

export function useNotificationToast() {
    const toast = useToast()

    const { notificationList, markAsNew, refetchNotification } =
        useNotificationQuery({
            filterByFn: (notification) => notification.isNew,
        })

    useEffect(() => {
        if (notificationList.length === 0) return

        if (
            notificationList.every((notification) =>
                toast.isActive(notification.id)
            )
        )
            return

        markAsNew({}).then(() => {
            refetchNotification().then()
        })

        notificationList.forEach((notification) => {
            if (toast.isActive(notification.id)) return
            toast({
                id: notification.id,
                title:
                    notification.type.slice(0, 1).toUpperCase() +
                    notification.type.slice(1),
                description: (
                    <ReactMarkdown>{notification.message}</ReactMarkdown>
                ),
                position: 'bottom-right',
                status: notification.type as
                    | 'error'
                    | 'info'
                    | 'warning'
                    | 'success',
                duration: 9000,
                isClosable: true,
            })
        })
    }, [notificationList, toast, markAsNew, refetchNotification])
}
