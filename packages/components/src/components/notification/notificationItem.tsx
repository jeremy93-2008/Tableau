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
import { useTableauMutation } from 'shared-hooks'
import axios from 'axios'
import { useCallback } from 'react'
import { useAtom } from 'jotai'
import { BoardAtom, RefetchBoardAtom } from 'shared-atoms'

export type INotificationEditValues = {
    id: string
    boardId: string
    isRead?: boolean
    isNew?: boolean
}

interface INotificationItemProps {
    notification: Notification
}

export function NotificationItem(props: INotificationItemProps) {
    const { notification } = props

    const [selectedBoard] = useAtom(BoardAtom)
    const [refetchBoard] = useAtom(RefetchBoardAtom)

    const { isOpen, onClose } = useDisclosure()

    const { mutateAsync } = useTableauMutation(
        (values: INotificationEditValues) => {
            return axios.post(`api/notification/edit`, values, {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            })
        }
    )

    const onNotificationClick = useCallback(() => {
        if (!notification.isRead)
            mutateAsync({
                boardId: selectedBoard?.id || '',
                id: notification.id,
                isRead: true,
            }).then(() => {
                refetchBoard.fetch()
            })
    }, [mutateAsync, notification, refetchBoard, selectedBoard])

    return (
        <Alert
            position="relative"
            status={
                notification.type as 'error' | 'info' | 'warning' | 'success'
            }
            key={notification.id}
            pl={6}
            borderRadius={5}
            cursor={notification.isRead ? 'default' : 'pointer'}
            sx={{
                '&:hover .box': {
                    transition: 'width 0.2s',
                    width: 3,
                },
            }}
        >
            <Flex width="100%" justifyContent="space-between">
                <Flex
                    className="box"
                    position="absolute"
                    top={0}
                    left={0}
                    width={2}
                    height={'100%'}
                    backgroundColor={'var(--alert-fg)'}
                />
                <Flex>
                    <AlertIcon />
                    <Box>{notification.message}</Box>
                </Flex>
                <Tooltip label="Remove Notification">
                    <CloseButton size="sm" onClick={onClose} />
                </Tooltip>
            </Flex>
        </Alert>
    )
}
