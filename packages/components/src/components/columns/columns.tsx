import React, { useCallback, WheelEvent } from 'react'
import { Avatar, Button, Flex, Text } from '@chakra-ui/react'
import { ColumnTask } from './columnTask'
import { useAtom } from 'jotai'
import { BoardAtom } from 'shared-atoms'
import { BsFillPeopleFill } from 'react-icons/bs'
import { ColumnShare } from './columnShare'
import { useThemeMode } from 'shared-hooks'

export function Columns() {
    const [selectedBoard] = useAtom(BoardAtom)

    const { text } = useThemeMode()

    const onHScroll = useCallback((event: WheelEvent<HTMLDivElement>) => {
        const container = document.getElementById('columns-container')
        const deltaMove =
            (event.nativeEvent as any).wheelDeltaX == -3
                ? (event.nativeEvent as any).wheelDeltaX
                : event.deltaY
        if (!container) return
        container.scrollTo({
            top: 0,
            left: container.scrollLeft + deltaMove,
        })
    }, [])

    return (
        <Flex flexDirection="column">
            <Flex
                alignItems="center"
                justifyContent="space-between"
                px={7}
                mt="28px"
                pt={3}
                height="32px"
            >
                <Text color={text.primary} fontWeight="medium" fontSize="18px">
                    {selectedBoard!.name}
                </Text>
                <Flex alignItems="center">
                    <ColumnShare />
                </Flex>
            </Flex>
            <Flex
                id="columns-container"
                flex={1}
                justifyContent="left"
                w={{ base: '100vw', md: 'calc(100vw - 300px)' }}
                px={5}
                pt={9}
                pb={9}
                overflowX="auto"
                overflowY="hidden"
                onWheel={onHScroll}
                style={{
                    scrollbarGutter: 'stable',
                }}
            >
                {selectedBoard!.Status.sort((a, b) => a.order - b.order).map(
                    (status) => (
                        <ColumnTask
                            key={status.id}
                            selectedBoard={selectedBoard!}
                            statusBoard={status}
                        />
                    )
                )}
                <ColumnTask selectedBoard={selectedBoard!} newColumn />
            </Flex>
        </Flex>
    )
}
