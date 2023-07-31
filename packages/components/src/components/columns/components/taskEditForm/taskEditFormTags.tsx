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
import { useTableauMutation } from 'shared-hooks'
import { IFullTask } from 'shared-types'
import { TaskEditFormTagsForm } from './taskEditFormTagsForm'
import { FormModal } from '../../modal/formModal'
import { DeleteModal } from '../../modal/deleteModal'

export interface ITagsEditFormikValues {
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

    const { isOpen, onOpen, onClose, onToggle } = useDisclosure()

    const initialValues: ITagsEditFormikValues = useMemo(
        () => ({
            name: '',
            color: '',
            boardId: task.boardId,
            taskId: task.id,
        }),
        [task]
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

    const onSubmit = useCallback(
        (values: ITagsEditFormikValues) => {
            return mutateCreateAsync({
                ...values,
            }).then(() => {
                refetchBoards.fetch()
                onClose()
            })
        },
        [refetchBoards, onClose, mutateCreateAsync]
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
            })
        },
        [refetchBoards, mutateDeleteAsync]
    )

    return (
        <Flex width="100%" alignItems="center" flexDirection="column" mb={1}>
            <Flex width="100%" flex={1} pl={2} mb={1}>
                <Text mr={2}>Tags</Text>
                <Tooltip label="Add a Tag">
                    <IconButton
                        onClick={onOpen}
                        aria-label="Add a Tag"
                        icon={<AddIcon />}
                        size="xs"
                    />
                </Tooltip>
                <FormModal
                    title={'Add Tag'}
                    isOpen={isOpen}
                    defaultValues={initialValues}
                    onClose={onClose}
                    onSubmit={onSubmit}
                    validationSchema={z.object({
                        name: z.string().min(3),
                        color: z.string().min(3),
                        taskId: z.string().min(3),
                        boardId: z.string().min(3),
                    })}
                >
                    {({ values, onFieldChange, error }) => (
                        <TaskEditFormTagsForm
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
                        bgColor={tag.color}
                        borderRadius="5px"
                        mr={2}
                        px={3}
                        py={1}
                    >
                        <Flex justifyContent="center" alignItems="center">
                            <Text mr={2}>{tag.name}</Text>
                            <IconButton
                                onClick={() => {
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
                            />
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
