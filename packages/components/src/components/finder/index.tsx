import React, {
    MutableRefObject,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react'
import axios, { AxiosResponse } from 'axios'
import { Box, Flex, Text, useDisclosure } from '@chakra-ui/react'
import { useTableauMutation } from 'shared-hooks'
import { Task } from '.prisma/client'
import { TaskItem } from '../columns/taskItem'
import { getScrollbarStyle } from 'shared-utils'
import { SearchInput } from './searchInput'
import { RiEmotionSadLine } from 'react-icons/ri'
import { useHighlightFinderTask } from './hook/useHighlightFinderTask'
import { useSession } from 'next-auth/react'

export type IFinderSearchResult = Record<IFinderSearchType, Task[]>

export type IFinderSearchType = 'task'

export interface IFinderSearchValues {
    searchText: string
    types: IFinderSearchType[]
}

export function Finder() {
    const { status } = useSession()
    const [result, setResult] = useState<IFinderSearchResult>({ task: [] })
    const portal = useRef<HTMLDivElement>()
    const { isOpen: isOpenDisclosure, onOpen, onClose } = useDisclosure()

    const isOpen = isOpenDisclosure && status !== 'unauthenticated'

    const { handleHighlightTask } = useHighlightFinderTask(() => onClose())

    const { mutateAsync, isLoading, isSuccess } = useTableauMutation<
        AxiosResponse<IFinderSearchResult, unknown>,
        IFinderSearchValues
    >(
        (values) => {
            return axios.post(`api/search`, values, {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            })
        },
        { noLoading: true }
    )

    const onClosePortalClickOutside = useCallback(
        (evt: Event) => {
            if (!portal.current) return
            const clickedTarget = evt.target as HTMLElement
            if (
                clickedTarget === portal.current ||
                portal.current?.contains(clickedTarget)
            )
                return
            onClose()
        },
        [onClose]
    )

    useEffect(() => {
        document.body.addEventListener('click', onClosePortalClickOutside)
        return () => {
            document.body.removeEventListener(
                'click',
                onClosePortalClickOutside
            )
        }
    }, [onClosePortalClickOutside])

    useEffect(() => {
        if (status !== 'unauthenticated' || result.task.length == 0) return
        setResult({ task: [] })
    }, [status, result, setResult])

    return (
        <Box ref={portal as MutableRefObject<HTMLDivElement>}>
            <SearchInput
                onClose={onClose}
                onOpen={onOpen}
                isLoading={isLoading}
                isSuccess={isSuccess}
                mutateAsync={mutateAsync}
                setResult={setResult}
            />
            <Flex
                flexDirection="column"
                bgColor="teal.500"
                position="absolute"
                width="35vw"
                minWidth="580px"
                minHeight={0}
                maxHeight={isOpen ? '500px' : '0'}
                height={isOpen ? 'auto' : '0'}
                marginLeft="min(-4vw, -125px)"
                borderRadius={10}
                overflowX="hidden"
                overflowY="auto"
                zIndex={13}
                boxShadow="7px 7px 15px -5px teal"
                transition="max-height .2s linear"
                {...getScrollbarStyle()}
            >
                <Text
                    display="block"
                    position="sticky"
                    top={0}
                    bgColor="teal.500"
                    fontWeight="medium"
                    fontSize={18}
                    px={8}
                    py={4}
                >
                    Tasks
                </Text>
                <Flex flexWrap="wrap" px={isOpen ? 5 : 0} pb={isOpen ? 3 : 0}>
                    {result.task.length == 0 && (
                        <Flex
                            flex={1}
                            flexDirection="column"
                            alignItems="center"
                            py={4}
                        >
                            <RiEmotionSadLine size="48px" />
                            <Text fontWeight="medium" mt={2}>
                                No Tasks found that match you criteria
                            </Text>
                        </Flex>
                    )}
                    {result.task.length > 0 &&
                        result.task.map((task) => {
                            return (
                                <Flex
                                    key={task.id}
                                    onClick={handleHighlightTask(task)}
                                    boxSizing="border-box"
                                    width="23%"
                                    maxWidth="150px"
                                    mr="2%"
                                    mb="2%"
                                >
                                    <TaskItem
                                        task={task}
                                        readonly
                                        noHighlightIt
                                        style={{ cursor: 'pointer' }}
                                    />
                                </Flex>
                            )
                        })}
                </Flex>
            </Flex>
        </Box>
    )
}
