import { Flex, Button, Spinner } from '@chakra-ui/react'
import { IoIosRefresh } from 'react-icons/io'
import React, { useCallback, useState } from 'react'
import { useTaskFormButtonRefreshVisibility } from '../hooks/useTaskFormButtonRefreshVisibility'

interface ITaskEditFormButtonRefreshProps {
    onRefresh: () => Promise<void>
}

export function TaskEditFormButtonRefresh(
    props: ITaskEditFormButtonRefreshProps
) {
    const { onRefresh } = props
    const [isLoading, setIsLoading] = useState(false)

    const { isVisible, setIsVisible, stopInterval } =
        useTaskFormButtonRefreshVisibility()

    const onRefreshClick = useCallback(() => {
        setIsLoading(true)
        setIsVisible(true)
        onRefresh().then(() => {
            setIsLoading(false)
        })
        stopInterval()
    }, [stopInterval, onRefresh])

    return (
        <Flex position="absolute" top={1} width="100%" justifyContent="center">
            <Button
                onClick={onRefreshClick}
                disabled={isLoading}
                aria-label="Refresh messages"
                leftIcon={isLoading ? <Spinner size="xs" /> : <IoIosRefresh />}
                size="sm"
                zIndex={200}
                opacity={isVisible ? 1 : 0}
                transition="opacity 0.2s"
                bgColor="gray.600"
                _hover={{
                    bgColor: 'gray.700',
                }}
            >
                {isLoading ? 'Fetching new messages' : 'Refresh messages'}
            </Button>
        </Flex>
    )
}
