import React from 'react'
import { FormikProps } from 'formik'
import {
    Button,
    ButtonGroup,
    Flex,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Text,
    VStack,
} from '@chakra-ui/react'
import { useThemeMode } from 'shared-hooks'
import { IFullTask } from 'shared-types'
import { ITaskEditFormikValues } from '../../../taskEdit'
import { TaskEditFormDescription } from './components/taskEditForm.description'

interface ITaskEditFormBodyProps {
    task: IFullTask
    form: FormikProps<ITaskEditFormikValues>
    footer: {
        onClose: () => void
        onOpenModal: () => void
    }
}

export function TaskEditFormBody(props: ITaskEditFormBodyProps) {
    const { task, form, footer } = props

    const theme = useThemeMode()

    return (
        <Flex width="100%" mb={4} flexDirection="row">
            <Tabs width="100%" colorScheme="teal" variant="soft-rounded">
                <TabList width="100%" justifyContent="center" pb={2}>
                    <Tab
                        color={theme.taskEditTab.text}
                        backgroundColor={theme.taskEditTab.bg}
                        height="30px"
                        _selected={{
                            color: theme.taskEditTab.textSelected,
                            backgroundColor: theme.taskEditTab.bgSelected,
                        }}
                    >
                        Description
                    </Tab>
                    <Tab
                        color={theme.taskEditTab.text}
                        backgroundColor={theme.taskEditTab.bg}
                        height="30px"
                        _selected={{
                            color: theme.taskEditTab.textSelected,
                            backgroundColor: theme.taskEditTab.bgSelected,
                        }}
                    >
                        Comments
                    </Tab>
                    <Tab
                        color={theme.taskEditTab.text}
                        backgroundColor={theme.taskEditTab.bg}
                        height="30px"
                        _selected={{
                            color: theme.taskEditTab.textSelected,
                            backgroundColor: theme.taskEditTab.bgSelected,
                        }}
                    >
                        History
                    </Tab>
                </TabList>
                <TabPanels>
                    <TabPanel p={0}>
                        <TaskEditFormDescription
                            task={task}
                            form={form}
                            footer={footer}
                        />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Flex>
    )
}
