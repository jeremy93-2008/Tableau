import { Flex, Button, Spinner } from '@chakra-ui/react'
import { IoIosRefresh } from 'react-icons/io'
import React, { useCallback, useState } from 'react'

interface ITaskEditFormButtonRefreshProps {
    onRefresh: () => Promise<void>
}

export function TaskEditFormButtonRefresh(
    props: ITaskEditFormButtonRefreshProps
) {
    const { onRefresh } = props

    const [isVisible, setIsVisible] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [isHovering, setIsHovering] = useState(false)

    const onRefreshClick = useCallback(() => {
        setIsLoading(true)
        setIsVisible(true)
        onRefresh().then(() => {
            setIsLoading(false)
        })
    }, [setIsVisible, onRefresh])

    const handleHoverRefresh = useCallback(
        (isHover: boolean) => {
            return () => {
                setIsHovering(isHover)
            }
        },
        [setIsHovering]
    )

    return (
        <Flex
            position="absolute"
            top={1}
            right={5}
            width="100%"
            justifyContent="right"
        >
            <Button
                onClick={onRefreshClick}
                onMouseEnter={handleHoverRefresh(true)}
                onMouseLeave={handleHoverRefresh(false)}
                disabled={isLoading}
                aria-label="Refresh messages"
                size="sm"
                zIndex={200}
                width={isHovering ? 'auto' : 0}
                maxW={isHovering ? '500px' : 0}
                opacity={isVisible ? 1 : 0}
                overflowX="hidden"
                transition="opacity 0.2s, max-width 0.4s"
                bgColor="gray.900"
                _hover={{
                    bgColor: 'gray.900',
                }}
            >
                <Flex mr={isHovering ? 1 : 0}>
                    {isLoading ? <Spinner size="xs" /> : <IoIosRefresh />}
                </Flex>
                <Flex>
                    {isHovering &&
                        (isLoading
                            ? 'Fetching new messages'
                            : 'Refresh messages')}
                </Flex>
            </Button>
        </Flex>
    )
}
