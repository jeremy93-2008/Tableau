import {
    Flex,
    Text,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
} from '@chakra-ui/react'
import { AxiosError } from 'axios'
import { z } from 'zod'
import { JSONPrettier } from './JSONPrettier'

interface IErrorProps {
    error: AxiosError<unknown, any>
}
export function ErrorDescription(props: IErrorProps) {
    const { error } = props

    // If the error is a string, just return it
    if (typeof error.response!.data === 'string')
        return <>{error.response!.data}</>

    const validationErrorObj = error.response!.data as {
        inputError: z.ZodError<any>
        checkError: { status: number; message: string }
        serverError?: string
    }

    return (
        <Flex>
            <Tabs mt={3} colorScheme="red" variant="soft-rounded">
                <TabList>
                    <Tab>Pretty</Tab>
                    <Tab>Raw</Tab>
                </TabList>
                <TabPanels
                    height="200px"
                    overflow="auto"
                    onWheel={(evt) => evt.stopPropagation()}
                    sx={{ width: '450px' }}
                >
                    <TabPanel>
                        <JSONPrettier json={validationErrorObj} />
                    </TabPanel>
                    <TabPanel>
                        <Text whiteSpace="pre-wrap">
                            {JSON.stringify(validationErrorObj, null, 4)}
                        </Text>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Flex>
    )
}
