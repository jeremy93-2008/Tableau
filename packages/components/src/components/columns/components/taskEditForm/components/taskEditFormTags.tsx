import React, { useCallback, useMemo, useState } from 'react'
import { FaTimes } from 'react-icons/fa'
import { useAtom } from 'jotai'
import axios from 'axios'
import { z } from 'zod'
import { AddIcon } from '@chakra-ui/icons'
import {
    Badge,
    Flex,
    IconButton,
    Text,
    Tooltip,
    useDisclosure,
} from '@chakra-ui/react'
import { RefetchBoardAtom } from 'shared-atoms'
import { useTableauMutation, useTableauQuery } from 'shared-hooks'
import { IFullTask } from 'shared-types'
import { TaskEditFormTagsForm } from './taskEditFormTagsForm'
import { FormModal } from '../../../modal/formModal'
import { DeleteModal } from '../../../modal/deleteModal'
import { Tag } from '@prisma/client'

export interface ITagsEditFormikValues {
    id?: string
    name: string
    color: string
    boardId: string
    taskId: string
}

export interface ITagsDeleteFormikValues {
    id: string
    boardId: string
}

export interface ITaskEditFormTagsProps {
    task: IFullTask
}

export function TaskEditFormTags(props: ITaskEditFormTagsProps) {
    const { task } = props

    const [refetchBoards] = useAtom(RefetchBoardAtom)

    const { isOpen, onOpen, onClose } = useDisclosure()

    const { data: allTags, refetch: refetchTags } = useTableauQuery<Tag[]>(
        ['api/tag/list'],
        {
            noLoading: true,
        }
    )

    const [tagToEdit, setTagToEdit] = useState<ITagsEditFormikValues | null>()

    const initialValues: ITagsEditFormikValues = useMemo(
        () => ({
            id: tagToEdit?.id ?? '',
            name: tagToEdit?.name ?? '',
            color: tagToEdit?.color ?? '',
            boardId: tagToEdit?.boardId ?? task.boardId,
            taskId: tagToEdit?.taskId ?? task.id,
        }),
        [task, tagToEdit]
    )

    const { mutateAsync: mutateCreateAsync } = useTableauMutation(
        (values: ITagsEditFormikValues) => {
            return axios.post(`api/tag/create`, values, {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            })
        }
    )

    const { mutateAsync: mutateEditAsync } = useTableauMutation(
        (values: ITagsEditFormikValues) => {
            return axios.post(`api/tag/edit`, values, {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            })
        }
    )

    const onSubmit = useCallback(
        (values: ITagsEditFormikValues) => {
            if (!tagToEdit)
                return mutateCreateAsync({
                    ...values,
                }).then(() => {
                    refetchBoards.fetch()
                    refetchTags()
                    onClose()
                })
            return mutateEditAsync({
                ...values,
            }).then(() => {
                refetchBoards.fetch()
                refetchTags()
                onClose()
            })
        },
        [
            tagToEdit,
            mutateCreateAsync,
            mutateEditAsync,
            refetchBoards,
            refetchTags,
            onClose,
        ]
    )

    const [tagToDelete, setTagToDelete] = useState<
        (ITagsDeleteFormikValues & { name: string }) | null
    >(null)

    const {
        isOpen: isOpenDeleteModal,
        onOpen: onOpenDeleteModal,
        onClose: onCloseDeleteModal,
    } = useDisclosure()

    const { mutateAsync: mutateDeleteAsync } = useTableauMutation(
        (values: ITagsDeleteFormikValues) => {
            return axios.post(`api/tag/delete`, values, {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            })
        }
    )

    const onDelete = useCallback(
        (values: ITagsDeleteFormikValues) => {
            return mutateDeleteAsync({
                ...values,
            }).then(() => {
                refetchBoards.fetch()
                refetchTags()
            })
        },
        [mutateDeleteAsync, refetchBoards, refetchTags]
    )
    return (
        <Flex width="100%" alignItems="center" flexDirection="column" mb={1}>
            <Flex width="100%" flex={1} pl={2} mb={1}>
                <Text mr={2}>Tags</Text>
                <Tooltip label="Add a Tag">
                    <IconButton
                        onClick={() => {
                            setTagToEdit(null)
                            onOpen()
                        }}
                        aria-label="Add a Tag"
                        icon={<AddIcon />}
                        size="xs"
                    />
                </Tooltip>
                <FormModal
                    title={tagToEdit ? `Edit Tag ${tagToEdit.name}` : `Add Tag`}
                    isOpen={isOpen}
                    defaultValues={initialValues}
                    onClose={onClose}
                    onSubmit={onSubmit}
                    validationSchema={z
                        .object({
                            name: z.string().min(3),
                            color: z.string().min(3),
                            taskId: z.string().min(3),
                            boardId: z.string().min(3),
                        })
                        .refine(
                            (val) => {
                                return (
                                    (tagToEdit &&
                                        val.name === tagToEdit.name &&
                                        val.color === tagToEdit.color) ||
                                    !task.tags?.find(
                                        (tag) =>
                                            tag.name === val.name &&
                                            tag.color === val.color
                                    )
                                )
                            },
                            {
                                message: 'Tag already exists',
                                path: ['already-exist-tag'],
                            }
                        )}
                >
                    {({ values, onFieldChange, error }) => (
                        <TaskEditFormTagsForm
                            allTags={allTags ?? []}
                            task={task}
                            values={values}
                            onFieldChange={onFieldChange}
                            error={error}
                        />
                    )}
                </FormModal>
            </Flex>
            <Flex
                onWheel={(evt) => evt.stopPropagation()}
                width="100%"
                overflowX="auto"
                pl={2}
                pt={1}
            >
                {task.tags.map((tag) => (
                    <Badge
                        key={tag.name}
                        onClick={() => {
                            setTagToEdit({
                                id: tag.id,
                                name: tag.name,
                                color: tag.color,
                                taskId: task.id,
                                boardId: task.boardId,
                            })
                            onOpen()
                        }}
                        bgColor={tag.color}
                        borderRadius="5px"
                        cursor="pointer"
                        mr={2}
                        px={3}
                        py={1}
                    >
                        <Flex justifyContent="center" alignItems="center">
                            <Tooltip label={`Edit Tag "${tag.name}"`}>
                                <Text mr={2}>{tag.name}</Text>
                            </Tooltip>
                            <Tooltip label={`Delete Tag "${tag.name}"`}>
                                <IconButton
                                    onClick={(evt) => {
                                        evt.stopPropagation()
                                        setTagToDelete({
                                            id: tag.id,
                                            boardId: task.boardId,
                                            name: tag.name,
                                        })
                                        onOpenDeleteModal()
                                    }}
                                    aria-label={'Delete Tag'}
                                    icon={<FaTimes />}
                                    size="xs"
                                    _hover={{
                                        bgColor: 'red.500',
                                    }}
                                />
                            </Tooltip>
                        </Flex>
                    </Badge>
                ))}
            </Flex>
            <DeleteModal
                title={`Delete Tag: ${tagToDelete?.name}`}
                isOpen={isOpenDeleteModal}
                onClose={onCloseDeleteModal}
                onSubmit={() => {
                    onDelete(tagToDelete!).then()
                    onCloseDeleteModal()
                }}
            />
        </Flex>
    )
}
