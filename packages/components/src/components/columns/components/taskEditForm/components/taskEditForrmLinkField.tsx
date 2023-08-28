import React, { useCallback, useState } from 'react'
import axios from 'axios'
import { z } from 'zod'
import {
    Flex,
    IconButton,
    Text,
    Tooltip,
    useDisclosure,
} from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import { FormModal } from '../../../modal/formModal'
import { IFullTask } from 'shared-types'
import { TextInput } from '../../../../textInput'
import { TaskEditFormLinkItem } from './taskEditFormLinkItem'

import { useTableauMutation } from 'shared-hooks'
import { useAtom } from 'jotai'
import { BoardAtom, RefetchBoardAtom } from 'shared-atoms'

export type ILinkFormikValues = {
    id?: string
    boardId: string
    taskId: string
    name: string
    url: string
}

interface ITaskEditFormLinkField {
    task: IFullTask
}

export function TaskEditFormLinkField(props: ITaskEditFormLinkField) {
    const { task } = props

    const [formTitle, setFormTitle] = useState('Add a Link')
    const [defaultValues, setDefaultValues] = useState({ name: '', url: '' })
    const [formMode, setFormMode] = useState<'create' | 'edit'>('create')

    const { isOpen, onOpen, onClose } = useDisclosure()

    const [selectedBoard] = useAtom(BoardAtom)
    const [refetchBoards] = useAtom(RefetchBoardAtom)

    const { mutateAsync: mutateCreateAsync } = useTableauMutation(
        (values: ILinkFormikValues) => {
            return axios.post(`api/link/create`, values, {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            })
        }
    )

    const { mutateAsync: mutateEditAsync } = useTableauMutation(
        (values: ILinkFormikValues) => {
            return axios.post(`api/link/edit`, values, {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            })
        }
    )

    const onSubmitLink = useCallback(
        (values: Omit<Omit<ILinkFormikValues, 'boardId'>, 'taskId'>) => {
            if (!selectedBoard) return
            if (formMode === 'create')
                return mutateCreateAsync({
                    ...values,
                    boardId: selectedBoard.id,
                    taskId: task.id,
                }).then(() => {
                    refetchBoards.fetch()
                    onClose()
                })
            if (formMode === 'edit')
                return mutateEditAsync({
                    ...values,
                    boardId: selectedBoard.id,
                    taskId: task.id,
                }).then(() => {
                    refetchBoards.fetch()
                    onClose()
                })
        },
        [
            selectedBoard,
            formMode,
            mutateCreateAsync,
            task,
            mutateEditAsync,
            refetchBoards,
            onClose,
        ]
    )

    const onOpenNewLinkForm = useCallback(() => {
        setDefaultValues({ name: '', url: '' })
        setFormTitle('Add a Link')
        setFormMode('create')
        return onOpen()
    }, [onOpen])

    const onOpenEditLinkForm = useCallback(
        (link: Omit<Omit<ILinkFormikValues, 'boardId'>, 'taskId'>) => {
            setDefaultValues(link)
            setFormTitle('Edit a Link')
            setFormMode('edit')
            return onOpen()
        },
        [onOpen]
    )

    return (
        <Flex flexDirection="column" flex={1}>
            <Flex flex={1}>
                <Text fontWeight="medium" mr={2}>
                    Links
                </Text>
                <Tooltip label={formTitle}>
                    <IconButton
                        onClick={onOpenNewLinkForm}
                        aria-label={formTitle}
                        icon={<AddIcon />}
                        size="xs"
                    />
                </Tooltip>
                <FormModal
                    title={formTitle}
                    isOpen={isOpen}
                    onClose={onClose}
                    defaultValues={defaultValues}
                    onSubmit={onSubmitLink}
                    validationSchema={z.object({
                        name: z.string().min(3),
                        url: z.string().url(),
                    })}
                >
                    {({ values, onFieldChange, error }) => (
                        <Flex flexDirection="column" gap={3}>
                            <TextInput
                                name="nameInput"
                                label="Name"
                                value={values.name}
                                onChange={(evt) =>
                                    onFieldChange(
                                        'name',
                                        (evt.target as HTMLInputElement).value
                                    )
                                }
                                onBlur={() => {}}
                                style={
                                    error?.name?.length > 0
                                        ? { border: 'solid 1px #F56565' }
                                        : {}
                                }
                            />
                            {error?.name?.map((err) => (
                                <Text key={err.path.join('.')} color="red.500">
                                    {err.message}
                                </Text>
                            ))}
                            <TextInput
                                name="urlInput"
                                label="URL"
                                value={values.url}
                                onChange={(evt) =>
                                    onFieldChange(
                                        'url',
                                        (evt.target as HTMLInputElement).value
                                    )
                                }
                                onBlur={() => {}}
                                style={
                                    error?.url?.length > 0
                                        ? { border: 'solid 1px #F56565' }
                                        : {}
                                }
                            />
                            {error?.url?.map((err) => (
                                <Text key={err.path.join('.')} color="red.500">
                                    {err.message}
                                </Text>
                            ))}
                        </Flex>
                    )}
                </FormModal>
            </Flex>
            <Flex flexDirection="column" flex={1} gap={2} ml={3} my={3}>
                {task.link.map((l) => (
                    <TaskEditFormLinkItem
                        key={l.id}
                        link={l}
                        onEdit={onOpenEditLinkForm}
                    />
                ))}
            </Flex>
        </Flex>
    )
}
