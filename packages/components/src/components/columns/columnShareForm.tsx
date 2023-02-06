import React, { useCallback } from 'react'
import axios from 'axios'
import { Avatar, CloseButton, Flex, Text, Tooltip } from '@chakra-ui/react'
import { IBoardWithAllRelation, IFullBoardSharing } from '../../types/types'
import { ActionMeta, Select, SingleValue } from 'chakra-react-select'
import {
    IOptionsMenuItem,
    useShareRolesOptions,
} from './hooks/useShareRolesOptions'
import { useTableauMutation } from 'shared-hooks'
import { useAtom } from 'jotai'
import { LoadingAtom } from 'shared-atoms'
import { ColumnShareFormNew } from './columnShareFormNew'

type IShareMutationEditValue = {
    id: string
    canEditContent: boolean
    canEditSchema: boolean
}

interface IColumnShareFormProps {
    selectedBoard: IBoardWithAllRelation
    boardsSharedUser: IFullBoardSharing[]
    refetchSharedBoard: () => void
}

export function ColumnShareForm(props: IColumnShareFormProps) {
    const { selectedBoard, boardsSharedUser, refetchSharedBoard } = props

    const [loading, setLoading] = useAtom(LoadingAtom)

    const { mutateAsync: mutateDeleteAsync } = useTableauMutation(
        (value: Partial<IShareMutationEditValue>) => {
            return axios.post(`api/share/delete`, value, {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            })
        }
    )

    const { mutateAsync: mutateEditAsync } = useTableauMutation(
        (value: IShareMutationEditValue) => {
            return axios.post(`api/share/edit`, value, {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            })
        }
    )

    const {
        Option,
        options,
        getBoardSharingRoleByUser,
        getHasCurrentUserSharingPermissions,
    } = useShareRolesOptions(selectedBoard)

    const getIsBoardOwner = useCallback(
        (boardShared: IFullBoardSharing) => {
            return boardShared.userId === selectedBoard?.userId
        },
        [selectedBoard]
    )

    const handleDeleteUserSharingPermission = useCallback(
        (boardShared: IFullBoardSharing) => () => {
            mutateDeleteAsync({ id: boardShared.id }).then(() => {
                window.setTimeout(() => {
                    refetchSharedBoard()
                })
            })
        },
        [mutateDeleteAsync, refetchSharedBoard]
    )

    const handleChangePermission = useCallback(
        (boardShared: IFullBoardSharing) =>
            (
                newValue: SingleValue<IOptionsMenuItem>,
                actionMeta: ActionMeta<IOptionsMenuItem>
            ) => {
                mutateEditAsync({
                    id: boardShared.id,
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
            <ColumnShareFormNew />
            {selectedBoard &&
                boardsSharedUser &&
                boardsSharedUser.map((boardShared, idx) => {
                    return (
                        <Flex
                            key={boardShared.id}
                            width="80%"
                            justifyContent="space-around"
                            gap={4}
                            alignItems="center"
                            mb={4}
                        >
                            <Avatar
                                name={boardShared.user.email!}
                                src={boardShared.user.image!}
                                size="sm"
                                zIndex={boardsSharedUser.length - idx}
                                cursor="pointer"
                                border={
                                    getIsBoardOwner(boardShared)
                                        ? 'solid 3px teal'
                                        : ''
                                }
                                style={{ zIndex: -1 }}
                            />
                            <Flex flexDirection="column">
                                <Text fontWeight="medium">
                                    {boardShared.user.name}
                                </Text>
                                <Text fontSize="12px">
                                    ({boardShared.user.email})
                                </Text>
                            </Flex>
                            <Flex gap={2} cursor="pointer">
                                <Select
                                    onChange={handleChangePermission(
                                        boardShared
                                    )}
                                    colorScheme="teal"
                                    selectedOptionColor="teal"
                                    defaultValue={getBoardSharingRoleByUser(
                                        boardShared
                                    )}
                                    size="sm"
                                    components={{ Option }}
                                    options={options}
                                    isSearchable={false}
                                    isDisabled={
                                        getIsBoardOwner(boardShared) ||
                                        !getHasCurrentUserSharingPermissions(
                                            boardShared
                                        )
                                    }
                                    chakraStyles={{
                                        container: (provided) => ({
                                            ...provided,
                                            width: '180px',
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
                                            border: 'solid 1px lightgray',
                                            borderRadius: '10px',
                                            width: '250px',
                                            maxHeight: '550px',
                                            bgColor: 'white',
                                        }),
                                    }}
                                />
                            </Flex>
                            <Flex>
                                <Tooltip label="Delete this Collaborator">
                                    <CloseButton
                                        onClick={handleDeleteUserSharingPermission(
                                            boardShared
                                        )}
                                        visibility={
                                            !getIsBoardOwner(boardShared)
                                                ? 'visible'
                                                : 'hidden'
                                        }
                                    />
                                </Tooltip>
                            </Flex>
                        </Flex>
                    )
                })}
        </Flex>
    )
}
