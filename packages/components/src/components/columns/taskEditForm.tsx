import { Formik, FormikHelpers } from 'formik'
import { TextInput } from '../textInput'
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
    useDisclosure,
    VStack,
} from '@chakra-ui/react'
import { WarningIcon } from '@chakra-ui/icons'
import React, { useCallback, useMemo } from 'react'
import * as Yup from 'yup'
import { ITaskEditFormikValues } from './taskEdit'
import { Task } from '.prisma/client'
import { IFullStatus, IFullTask } from 'shared-types'
import { BsTrashFill } from 'react-icons/bs'
import { DeleteModal } from './modal/deleteModal'
import { TaskEditFormAssignedUser } from './components/taskEditForm/taskEditFormAssignedUser'
import { TaskEditFormChecklistField } from './components/taskEditForm/taskEditFormChecklistField'
import { TaskEditFormLinkField } from './components/taskEditForm/taskEditForrmLinkField'
import { TaskEditFormStartDueDate } from './components/taskEditForm/taskEditFormStartDueDate'
import { TaskEditFormNotification } from './components/taskEditForm/taskEditFormNotification'
import { useThemeMode } from 'shared-hooks'
import { TaskEditFormTags } from './components/taskEditForm/taskEditFormTags'

interface ITaskEditForm {
    task: IFullTask
    status: IFullStatus
    onTaskEditSubmit: (
        values: ITaskEditFormikValues,
        actions: FormikHelpers<ITaskEditFormikValues>
    ) => void
    onTaskDelete: (task: Task) => void
    onClose: () => void
}

export function TaskEditForm(props: ITaskEditForm) {
    const { task, status, onTaskEditSubmit, onTaskDelete, onClose } = props

    const theme = useThemeMode()

    const {
        isOpen: isOpenModal,
        onClose: onCloseModal,
        onOpen: onOpenModal,
    } = useDisclosure()

    const initialValues: ITaskEditFormikValues = useMemo(
        () => ({
            id: task.id,
            name: task.name || '',
            description: task.description || '',
            boardId: task.boardId || '',
            statusId: status.id,
            elapsedTime: task.elapsedTime || 0,
            estimatedTime: task.estimatedTime || 0,
            order: task.order || 999,
            assignedUserIds:
                task.assignedUsers.map(
                    (assignedUser) => assignedUser.User.id
                ) ?? undefined,
        }),
        [task, status]
    )

    const validationSchema = useMemo(
        () =>
            Yup.object().shape({
                id: Yup.string().required('Task Id is required'),
                name: Yup.string().required('Task Name is required'),
                description: Yup.string(),
                boardId: Yup.string().required('Board Id is required'),
                statusId: Yup.string().required('Status Id is required'),
                elapsedTime: Yup.number(),
                estimatedTime: Yup.number(),
                assignedUserIds: Yup.array(Yup.string()).nullable(),
            }),
        []
    )

    const onSubmit = useCallback(
        (
            values: ITaskEditFormikValues,
            actions: FormikHelpers<ITaskEditFormikValues>
        ) => {
            onTaskEditSubmit(values, actions)
        },
        [onTaskEditSubmit]
    )

    return (
        <>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
            >
                {(props) => (
                    <form onSubmit={props.handleSubmit}>
                        <Flex
                            mb={2}
                            flexDirection="row"
                            justifyContent="space-between"
                        >
                            <TaskEditFormTags task={task} />
                        </Flex>
                        <Flex
                            mb={2}
                            flexDirection="row"
                            justifyContent="space-between"
                        >
                            <TaskEditFormAssignedUser
                                assignedUsersIds={props.values.assignedUserIds}
                                setAssignedUser={(
                                    assignedUserIds: string[] | null
                                ) => {
                                    props.setValues({
                                        ...props.values,
                                        assignedUserIds:
                                            assignedUserIds ?? undefined,
                                    })
                                }}
                            />
                            <TaskEditFormStartDueDate
                                startDate={task.startDate}
                                endDate={task.endDate}
                            />
                            <TaskEditFormNotification />
                        </Flex>
                        <Flex width="100%" mb={4} flexDirection="row">
                            <Tabs
                                width="100%"
                                colorScheme="teal"
                                variant="soft-rounded"
                            >
                                <TabList
                                    width="100%"
                                    justifyContent="center"
                                    pb={2}
                                >
                                    <Tab
                                        color={theme.taskEditTab.text}
                                        backgroundColor={theme.taskEditTab.bg}
                                        height="30px"
                                        _selected={{
                                            color: theme.taskEditTab
                                                .textSelected,
                                            backgroundColor:
                                                theme.taskEditTab.bgSelected,
                                        }}
                                    >
                                        Description
                                    </Tab>
                                    <Tab
                                        color={theme.taskEditTab.text}
                                        backgroundColor={theme.taskEditTab.bg}
                                        height="30px"
                                        _selected={{
                                            color: theme.taskEditTab
                                                .textSelected,
                                            backgroundColor:
                                                theme.taskEditTab.bgSelected,
                                        }}
                                    >
                                        Comments
                                    </Tab>
                                    <Tab
                                        color={theme.taskEditTab.text}
                                        backgroundColor={theme.taskEditTab.bg}
                                        height="30px"
                                        _selected={{
                                            color: theme.taskEditTab
                                                .textSelected,
                                            backgroundColor:
                                                theme.taskEditTab.bgSelected,
                                        }}
                                    >
                                        History
                                    </Tab>
                                </TabList>
                                <TabPanels>
                                    <TabPanel p={0}>
                                        <Flex
                                            maxH="65vh"
                                            flexDirection="column"
                                        >
                                            <Flex
                                                minH={0}
                                                flex={1}
                                                onWheel={(evt) =>
                                                    evt.stopPropagation()
                                                }
                                                overflowY="auto"
                                                flexDirection="column"
                                            >
                                                <TextInput
                                                    label="Name"
                                                    name="name"
                                                    value={props.values.name}
                                                    onChange={
                                                        props.handleChange
                                                    }
                                                    onBlur={props.handleBlur}
                                                    style={
                                                        props.errors.name
                                                            ? {
                                                                  backgroundColor:
                                                                      'var(--chakra-colors-red-200)',
                                                              }
                                                            : {}
                                                    }
                                                />
                                                {props.errors.name ? (
                                                    <Flex
                                                        alignItems="center"
                                                        color="red.500"
                                                        ml="2"
                                                    >
                                                        <WarningIcon />
                                                        <Text
                                                            fontSize="13px"
                                                            m="1"
                                                        >
                                                            Task Name is
                                                            required
                                                        </Text>
                                                    </Flex>
                                                ) : null}
                                                <VStack mb={4} />
                                                <TextInput
                                                    type="textarea"
                                                    label="Description"
                                                    name="description"
                                                    value={
                                                        props.values.description
                                                    }
                                                    onChange={
                                                        props.handleChange
                                                    }
                                                    onBlur={props.handleBlur}
                                                />
                                                <Flex mt={4}>
                                                    <TaskEditFormChecklistField
                                                        task={task}
                                                    />
                                                </Flex>
                                                <Flex mt={2}>
                                                    <TaskEditFormLinkField
                                                        task={task}
                                                    />
                                                </Flex>
                                                <Flex mt={4} gap={2}>
                                                    <TextInput
                                                        type="number"
                                                        min={0}
                                                        label="Elapsed Time"
                                                        name="elapsedTime"
                                                        value={props.values.elapsedTime.toString()}
                                                        onChange={
                                                            props.handleChange
                                                        }
                                                        onBlur={
                                                            props.handleBlur
                                                        }
                                                    />
                                                    <TextInput
                                                        type="number"
                                                        min={0}
                                                        label="Estimated Time"
                                                        name="estimatedTime"
                                                        value={props.values.estimatedTime.toString()}
                                                        onChange={
                                                            props.handleChange
                                                        }
                                                        onBlur={
                                                            props.handleBlur
                                                        }
                                                    />
                                                </Flex>
                                            </Flex>
                                            <ButtonGroup
                                                display="flex"
                                                flex="0"
                                                justifyContent="space-between"
                                                mt="6"
                                            >
                                                <ButtonGroup
                                                    display="flex"
                                                    justifyContent="flex-start"
                                                >
                                                    <Button
                                                        data-cy="buttonEditDelete"
                                                        onClick={() =>
                                                            onOpenModal()
                                                        }
                                                        leftIcon={
                                                            <BsTrashFill />
                                                        }
                                                        colorScheme="red"
                                                        mr={1}
                                                    >
                                                        Delete
                                                    </Button>
                                                </ButtonGroup>
                                                <ButtonGroup
                                                    display="flex"
                                                    justifyContent="flex-end"
                                                >
                                                    <Button onClick={onClose}>
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        data-cy="buttonEditSave"
                                                        type="submit"
                                                        colorScheme="teal"
                                                        mr={1}
                                                    >
                                                        Save
                                                    </Button>
                                                </ButtonGroup>
                                            </ButtonGroup>
                                        </Flex>
                                    </TabPanel>
                                </TabPanels>
                            </Tabs>
                        </Flex>
                    </form>
                )}
            </Formik>
            <DeleteModal
                title="Delete Task"
                isOpen={isOpenModal}
                onClose={onCloseModal}
                onSubmit={() => {
                    onTaskDelete(task)
                    onCloseModal()
                    onClose()
                }}
            />
        </>
    )
}
