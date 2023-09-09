import React, { useState } from 'react'
import { FormikProps } from 'formik'
import { Flex, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import { useThemeMode } from 'shared-hooks'
import { IFullTask } from 'shared-types'
import { TaskFormEditTab } from 'shared-utils'
import { ITaskEditFormikValues } from '../../../taskEdit'
import { TaskEditFormDescription } from './components/taskEditForm.description'
import { TaskEditFormComments } from './components/taskEditForm.comments'
import { TaskEditFormHistory } from './components/taskEditForm.history'

interface ITaskEditFormBodyProps {
    task: IFullTask
    form: FormikProps<ITaskEditFormikValues>
}

export function TaskEditFormBody(props: ITaskEditFormBodyProps) {
    const { task, form } = props

    const theme = useThemeMode()

    const [tabIndex, setTabIndex] = useState(TaskFormEditTab.Description)

    return (
        <Flex width="100%" mb={4} flexDirection="row">
            <Tabs
                onChange={(idx) => setTabIndex(idx)}
                width="100%"
                colorScheme="teal"
                variant="soft-rounded"
            >
                <TabList width="100%" justifyContent="center">
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
                            isVisible={tabIndex === TaskFormEditTab.Description}
                        />
                    </TabPanel>
                    <TabPanel p={0} pt={3}>
                        <TaskEditFormComments
                            task={task}
                            form={form}
                            isVisible={tabIndex === TaskFormEditTab.Comments}
                        />
                    </TabPanel>
                    <TabPanel p={0}>
                        <TaskEditFormHistory
                            task={task}
                            form={form}
                            isVisible={tabIndex === TaskFormEditTab.History}
                        />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Flex>
    )
}
