import axios from 'axios'
import { Button, Flex, Tag, Text } from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'
import { GroupBase, Select, SelectInstance } from 'chakra-react-select'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import {
    IOptionsMenuItem,
    useShareRolesOptions,
} from './hooks/useShareRolesOptions'
import { useAtom } from 'jotai'
import { BoardAtom } from 'shared-atoms'
import { FaUserPlus } from 'react-icons/fa'
import { useTableauMutation, useTableauQuery, useThemeMode } from 'shared-hooks'
import { User } from '.prisma/client'
import { useSession } from 'next-auth/react'
import { IFullBoardSharing } from 'shared-types'

type IShareMutationAddValue = {
    boardId: string
    email: string
    canEditContent: boolean
    canEditSchema: boolean
}

interface IColumnShareFormNewProps {
    boardsSharedUser: IFullBoardSharing[]
    refetchSharedBoard: () => void
    permissions: {
        add: boolean
        userBoardSharing: Map<string, { edit: boolean; delete: boolean }>
    } | null
}

export function ColumnShareFormNew(props: IColumnShareFormNewProps) {
    const { boardsSharedUser, refetchSharedBoard, permissions } = props
    const toast = useToast()
    const { data: session } = useSession()
    const [selectedBoard] = useAtom(BoardAtom)

    const refSelectedUserDropdown = useRef<SelectInstance<
        any,
        false,
        GroupBase<any>
    > | null>(null)
    const refSelectedRoleDropdown = useRef<SelectInstance<
        any,
        false,
        GroupBase<any>
    > | null>(null)

    const { bg, text, boxShadow } = useThemeMode()

    const { Option, options: optionsRole } = useShareRolesOptions(
        selectedBoard!
    )
    const [selectedUser, setSelectedUser] = useState<{
        label: string
        value: string
    }>()
    const [selectedRole, setSelectedRole] = useState(optionsRole[3])
    const [inputText, setInputText] = useState('')

    const { data } = useTableauQuery<User[]>(['api/user/list'], {
        noLoading: true,
    })

    const optionsUser = useMemo(() => {
        if (!data || !session || !session.user) return []
        const userList = data
            .filter(
                (user) =>
                    !boardsSharedUser.find(
                        (sharedUser) => sharedUser.user.email === user.email
                    )
            )
            .map((d) => ({
                label: `${d.email} (${d.name})`,
                value: d.email!,
            }))
        if (!inputText) return userList
        return [{ label: inputText, value: inputText }, ...userList]
    }, [boardsSharedUser, data, inputText, session])

    const { mutateAsync: mutateAddAsync, isLoading } = useTableauMutation(
        (value: IShareMutationAddValue) => {
            return axios.post(`api/share/add`, value, {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            })
        },
        { noLoading: true }
    )

    const handleClickInvite = useCallback(() => {
        if (!selectedBoard || !selectedUser) return
        mutateAddAsync({
            boardId: selectedBoard?.id,
            email: selectedUser?.value,
            canEditSchema: selectedRole.canEditSchema,
            canEditContent: selectedRole.canEditContent,
        }).then((response) => {
            if (!response.data.isUserAlreadyHasAccount)
                toast({
                    title: 'New collaborator',
                    description:
                        'We send a email to invite you collaborator to join you board',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                })
            window.setTimeout(() => {
                refetchSharedBoard()
                setInputText('')
                setSelectedUser(undefined)
                if (refSelectedUserDropdown.current)
                    refSelectedUserDropdown.current.clearValue()
                setSelectedRole(optionsRole[3])
            })
        })
    }, [
        selectedBoard,
        selectedUser,
        mutateAddAsync,
        selectedRole.canEditSchema,
        selectedRole.canEditContent,
        toast,
        refetchSharedBoard,
        optionsRole,
    ])

    return (
        <Flex width="100%" flexDirection="column">
            <Text fontSize={12} fontWeight="medium">
                Add a Collaborator
            </Text>
            <Flex
                width="100%"
                mb={5}
                alignItems="center"
                justifyContent="space-between"
                cursor="pointer"
            >
                <Select
                    ref={refSelectedUserDropdown}
                    size="sm"
                    components={{
                        DropdownIndicator: () => null,
                        IndicatorSeparator: () => null,
                    }}
                    inputValue={inputText}
                    value={selectedUser}
                    onInputChange={(val, actionMeta) => {
                        if (
                            actionMeta.action === 'input-blur' ||
                            actionMeta.action === 'menu-close'
                        )
                            return
                        setInputText(val)
                        if (!val) return setSelectedUser(undefined)
                        setSelectedUser({ label: val, value: val })
                    }}
                    onChange={(val) => setSelectedUser(val as IOptionsMenuItem)}
                    isDisabled={!permissions?.add}
                    placeholder="Email"
                    options={optionsUser}
                    chakraStyles={{
                        container: (provided) => ({
                            ...provided,
                            width: '250px',
                        }),
                        control: (provided) => ({
                            ...provided,
                            '&[data-focus=true]': {
                                borderColor: 'teal',
                                boxShadow: '0 0 0 1px teal',
                            },
                        }),
                        option: (provided) => ({
                            ...provided,
                            background: bg.modal,
                            color: text.contrast,
                            '&:hover': {
                                background: bg.modalHover,
                                color: text.hover,
                            },
                        }),
                        menuList: (provided) => ({
                            ...provided,
                            zIndex: 100,
                            p: '8px',
                            border: 'solid 1px',
                            borderColor: bg.modal,
                            borderRadius: '10px',
                            width: '250px',
                            maxHeight: '550px',
                            bgColor: bg.modal,
                            boxShadow: boxShadow.primary,
                        }),
                    }}
                />
                <Select
                    ref={refSelectedRoleDropdown}
                    onChange={(val) => setSelectedRole(val as IOptionsMenuItem)}
                    value={selectedRole}
                    size="sm"
                    components={{ Option }}
                    options={optionsRole}
                    isSearchable={false}
                    isDisabled={!permissions?.add}
                    chakraStyles={{
                        container: (provided) => ({
                            ...provided,
                            width: '150px',
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
                <Button
                    isDisabled={
                        !permissions?.add ||
                        !selectedUser ||
                        !selectedRole ||
                        isLoading
                    }
                    onClick={handleClickInvite}
                    colorScheme="teal"
                    leftIcon={<FaUserPlus />}
                >
                    Invite
                </Button>
            </Flex>
        </Flex>
    )
}
