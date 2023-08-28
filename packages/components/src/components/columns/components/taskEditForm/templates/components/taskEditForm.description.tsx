import React from 'react'
import { FormikProps } from 'formik'
import { Button, ButtonGroup, Flex, Text, VStack } from '@chakra-ui/react'
import { WarningIcon } from '@chakra-ui/icons'
import { BsTrashFill } from 'react-icons/bs'
import { IFullTask } from 'shared-types'
import { TaskEditFormChecklistField } from '../../components/taskEditFormChecklistField'
import { TaskEditFormLinkField } from '../../components/taskEditForrmLinkField'
import { ITaskEditFormikValues } from '../../../../taskEdit'
import { TextInput } from '../../../../../textInput'

interface ITaskEditFormBodyProps {
    task: IFullTask
    form: FormikProps<ITaskEditFormikValues>
    footer: {
        onClose: () => void
        onOpenModal: () => void
    }
}

export function TaskEditFormDescription(props: ITaskEditFormBodyProps) {
    const { task, form, footer } = props
    return (
        <Flex maxH="65vh" flexDirection="column">
            <Flex
                minH={0}
                flex={1}
                onWheel={(evt) => evt.stopPropagation()}
                overflowY="auto"
                flexDirection="column"
            >
                <TextInput
                    label="Name"
                    name="name"
                    value={form.values.name}
                    onChange={form.handleChange}
                    onBlur={form.handleBlur}
                    style={
                        form.errors.name
                            ? {
                                  backgroundColor:
                                      'var(--chakra-colors-red-200)',
                              }
                            : {}
                    }
                />
                {form.errors.name ? (
                    <Flex alignItems="center" color="red.500" ml="2">
                        <WarningIcon />
                        <Text fontSize="13px" m="1">
                            Task Name is required
                        </Text>
                    </Flex>
                ) : null}
                <VStack mb={4} />
                <TextInput
                    type="textarea"
                    label="Description"
                    name="description"
                    value={form.values.description}
                    onChange={form.handleChange}
                    onBlur={form.handleBlur}
                />
                <Flex mt={4}>
                    <TaskEditFormChecklistField task={task} />
                </Flex>
                <Flex mt={2}>
                    <TaskEditFormLinkField task={task} />
                </Flex>
                <Flex mt={4} gap={2}>
                    <TextInput
                        type="number"
                        min={0}
                        label="Elapsed Time"
                        name="elapsedTime"
                        value={form.values.elapsedTime.toString()}
                        onChange={form.handleChange}
                        onBlur={form.handleBlur}
                    />
                    <TextInput
                        type="number"
                        min={0}
                        label="Estimated Time"
                        name="estimatedTime"
                        value={form.values.estimatedTime.toString()}
                        onChange={form.handleChange}
                        onBlur={form.handleBlur}
                    />
                </Flex>
            </Flex>
            <ButtonGroup
                display="flex"
                flex="0"
                justifyContent="space-between"
                mt="6"
            >
                <ButtonGroup display="flex" justifyContent="flex-start">
                    <Button
                        data-cy="buttonEditDelete"
                        onClick={() => footer.onOpenModal()}
                        leftIcon={<BsTrashFill />}
                        colorScheme="red"
                        mr={1}
                    >
                        Delete
                    </Button>
                </ButtonGroup>
                <ButtonGroup display="flex" justifyContent="flex-end">
                    <Button onClick={footer.onClose}>Cancel</Button>
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
    )
}
