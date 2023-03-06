import React, { useCallback } from 'react'
import axios from 'axios'
import {
    Avatar,
    CloseButton,
    Flex,
    Tag,
    Text,
    Tooltip,
    useDisclosure,
} from '@chakra-ui/react'
import { IBoardWithAllRelation, IFullBoardSharing } from '../../types/types'
import { ActionMeta, Select, SingleValue } from 'chakra-react-select'
import {
    IOptionsMenuItem,
    useShareRolesOptions,
} from './hooks/useShareRolesOptions'
import { useTableauMutation, useTableauRoute, useThemeMode } from 'shared-hooks'
import { ColumnShareFormNew } from './columnShareFormNew'
import { useSession } from 'next-auth/react'
import { DeleteModal } from './modal/deleteModal'
import { useShareRolesPermission } from './hooks/useShareRolesPermission'
import { useAtom } from 'jotai'
import { BoardAtom, RefetchBoardAtom } from 'shared-atoms'

type IShareMutationEditValue = {
    id: string
    canEditContent: boolean
    canEditSchema: boolean
}

interface IColumnShareFormProps {
    selectedBoard: IBoardWithAllRelation
    boardsSharedUser: IFullBoardSharing[]
    refetchSharedBoard: () => void
    onClose: () => void
}

export function ColumnShareForm(props: IColumnShareFormProps) {
    const { selectedBoard, boardsSharedUser, refetchSharedBoard, onClose } =
        props
    const [_selectedBoard, setSelectedBoard] = useAtom(BoardAtom)
    const [refetchBoards] = useAtom(RefetchBoardAtom)
    const { data: session } = useSession()

    const { bg } = useThemeMode()

    const {
        isOpen: isDeleteModalOpen,
        onOpen: onDeleteModalOpen,
        onClose: onDeleteModalClose,
    } = useDisclosure()

    const { mutateAsync: mutateDeleteAsync } = useTableauMutation(
        (value: Partial<IShareMutationEditValue>) => {
            return axios.post(`api/share/delete`, value, {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            })
        },
        { noLoading: true }
    )

    const { mutateAsync: mutateEditAsync } = useTableauMutation(
        (value: IShareMutationEditValue) => {
            return axios.post(`api/share/edit`, value, {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            })
        },
        { noLoading: true }
    )

    const { permissions } = useShareRolesPermission(boardsSharedUser)

    const { Option, options, getBoardSharingRoleByUser } =
        useShareRolesOptions(selectedBoard)

    const { pushReset } = useTableauRoute()

    const handleDeleteUserSharingPermission = useCallback(
        (userBoardShared: IFullBoardSharing) => () => {
            onDeleteModalClose()
            mutateDeleteAsync({ id: userBoardShared.id }).then(() => {
                window.setTimeout(() => {
                    refetchSharedBoard()
                    refetchBoards.fetch()
                    setSelectedBoard(null)
                    pushReset()
                    onClose()
                })
            })
        },
        [
            mutateDeleteAsync,
            onDeleteModalClose,
            refetchBoards,
            refetchSharedBoard,
        ]
    )

    const handleChangePermission = useCallback(
        (userBoardShared: IFullBoardSharing) =>
            (
                newValue: SingleValue<IOptionsMenuItem>,
                actionMeta: ActionMeta<IOptionsMenuItem>
            ) => {
                mutateEditAsync({
                    id: userBoardShared.id,
                    canEditSchema: newValue!.canEditSchema,
                    canEditContent: newValue!.canEditContent,
                }).then(() => {
                    window.setTimeout(() => {
                        refetchSharedBoard()
                    })
                })
            },
        [mutateEditAsync, refetchSharedBoard]
    )

    return (
        <Flex flexDirection="column" alignItems="center">
            {!permissions?.add && (
                <Tag mb={2} colorScheme="red">
                    You don&apos;t have permission to add or modify new
                    collaborator
                </Tag>
            )}
            <ColumnShareFormNew
                boardsSharedUser={boardsSharedUser}
                refetchSharedBoard={refetchSharedBoard}
                permissions={permissions}
            />
            {selectedBoard &&
                permissions &&
                boardsSharedUser &&
                boardsSharedUser.map((userBoardShared, idx) => {
                    return (
                        <Flex
                            key={userBoardShared.id}
                            width="80%"
                            justifyContent="space-around"
                            gap={4}
                            alignItems="center"
                            mb={4}
                        >
                            <Avatar
                                name={userBoardShared.user.email!}
                                src={userBoardShared.user.image!}
                                size="sm"
                                zIndex={boardsSharedUser.length - idx}
                                cursor="pointer"
                                style={{ zIndex: -1 }}
                                referrerPolicy="no-referrer"
                            />
                            <Flex flexDirection="column">
                                <Text fontWeight="medium">
                                    {userBoardShared.user.name}
                                </Text>
                                <Text fontSize="12px" whiteSpace="nowrap">
                                    ({userBoardShared.user.email})
                                </Text>
                            </Flex>
                            <Flex gap={2} cursor="pointer">
                                <Select
                                    onChange={handleChangePermission(
                                        userBoardShared
                                    )}
                                    colorScheme="teal"
                                    selectedOptionColor="teal"
                                    defaultValue={getBoardSharingRoleByUser(
                                        userBoardShared
                                    )}
                                    isDisabled={
                                        !permissions.userBoardSharing.get(
                                            userBoardShared.id
                                        )!.edit
                                    }
                                    size="sm"
                                    components={{ Option }}
                                    options={options}
                                    isSearchable={false}
                                    chakraStyles={{
                                        container: (provided) => ({
                                            ...provided,
                                            width: {
                                                base: '100px',
                                                lg: '180px',
                                            },
                                        }),
                                        control: (provided) => ({
                                            ...provided,
                                            '&[data-focus=true]': {
                                                borderColor: 'teal',
                                                boxShadow: '0 0 0 1px teal',
                                            },
                                        }),
                                        menuList: (provided) => ({
                                            ...provided,
                                            p: '8px',
                                            border: 'solid 1px',
                                            borderColor: bg.modal,
                                            borderRadius: '10px',
                                            width: '250px',
                                            maxHeight: '550px',
                                            bgColor: bg.modal,
                                        }),
                                    }}
                                />
                            </Flex>
                            <Flex>
                                <Tooltip label="Delete this Collaborator">
                                    <CloseButton
                                        isDisabled={
                                            !permissions.userBoardSharing.get(
                                                userBoardShared.id
                                            )!.delete
                                        }
                                        onClick={() => onDeleteModalOpen()}
                                    />
                                </Tooltip>
                                <DeleteModal
                                    title="Delete this Collaborator"
                                    onClose={onDeleteModalClose}
                                    isOpen={isDeleteModalOpen}
                                    onSubmit={handleDeleteUserSharingPermission(
                                        userBoardShared
                                    )}
                                />
                            </Flex>
                        </Flex>
                    )
                })}
        </Flex>
    )
}
