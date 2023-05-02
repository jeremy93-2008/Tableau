import { Notification } from '@prisma/client'
import {
    Alert,
    AlertIcon,
    Box,
    CloseButton,
    Flex,
    Tooltip,
    useDisclosure,
} from '@chakra-ui/react'
import { useNotificationQuery } from './hooks/useNotificationQuery'

interface INotificationItemProps {
    notification: Notification
}

export function NotificationItem(props: INotificationItemProps) {
    const { notification } = props

    const { isOpen, onClose } = useDisclosure({ isOpen: true })

    const { deleteNotification, refetchNotification } = useNotificationQuery({})

    return (
        <>
            {isOpen && (
                <Alert
                    position="relative"
                    status={
                        notification.type as
                            | 'error'
                            | 'info'
                            | 'warning'
                            | 'success'
                    }
                    key={notification.id}
                    pl={4}
                    borderRadius={5}
                    cursor={notification.isRead ? 'default' : 'pointer'}
                    sx={{
                        '&:hover .alert-container .box': {
                            transition: 'width 0.2s',
                            width: notification.isRead ? '0' : '8px',
                        },
                        '&:hover .alert-container': {
                            transition: 'opacity 0.2s',
                            opacity: '1',
                        },
                    }}
                >
                    <Flex
                        className="alert-container"
                        width="100%"
                        justifyContent="space-between"
                        opacity={notification.isRead ? '0.7' : '1'}
                    >
                        <Flex
                            className="box"
                            position="absolute"
                            top={0}
                            left={0}
                            width={notification.isRead ? '0' : '5px'}
                            height={'100%'}
                            backgroundColor={'var(--alert-fg)'}
                        />
                        <Flex>
                            <AlertIcon />
                            <Box>{notification.message}</Box>
                        </Flex>
                        {notification.isRead && (
                            <Tooltip label="Remove Notification">
                                <CloseButton
                                    size="sm"
                                    onClick={() => {
                                        deleteNotification([
                                            'single',
                                            notification,
                                        ]).then(() => {
                                            refetchNotification().then()
                                        })
                                        onClose()
                                    }}
                                />
                            </Tooltip>
                        )}
                    </Flex>
                </Alert>
            )}
        </>
    )
}
