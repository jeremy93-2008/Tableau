import React, { useCallback, WheelEvent } from 'react'
import { Flex, Text } from '@chakra-ui/react'
import { ColumnTask } from './columnTask'
import { useAtom } from 'jotai'
import { BoardAtom } from 'shared-atoms'

export function Columns() {
    const [selectedBoard] = useAtom(BoardAtom)

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
            <Text
                color="gray.600"
                fontWeight="medium"
                fontSize="18px"
                px={5}
                pt={'33px'}
            >
                {selectedBoard!.name}
            </Text>
            <Flex
                id="columns-container"
                flex={1}
                justifyContent="left"
                w={'calc(100vw - 300px)'}
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
