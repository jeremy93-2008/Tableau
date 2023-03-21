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
        stackTrace?: string
    }

    return (
        <Flex>
            <Tabs mt={3} colorScheme="red" variant="soft-rounded">
                <TabList>
                    <Tab>Pretty</Tab>
                    <Tab>Raw</Tab>
                </TabList>
                <TabPanels h={'200px'} overflowY={'auto'}>
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
