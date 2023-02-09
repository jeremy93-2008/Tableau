import axios from 'axios'
import { Button, Flex, Text } from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'
import { Select } from 'chakra-react-select'
import React, { useCallback, useMemo, useState } from 'react'
import {
    IOptionsMenuItem,
    useShareRolesOptions,
} from './hooks/useShareRolesOptions'
import { useAtom } from 'jotai'
import { BoardAtom } from 'shared-atoms'
import { FaUserPlus } from 'react-icons/fa'
import { useTableauMutation, useTableauQuery } from 'shared-hooks'
import { User } from '.prisma/client'
import { useSession } from 'next-auth/react'

type IShareMutationAddValue = {
    boardId: string
    email: string
    canEditContent: boolean
    canEditSchema: boolean
}

interface IColumnShareFormNewProps {
    refetchSharedBoard: () => void
}

export function ColumnShareFormNew(props: IColumnShareFormNewProps) {
    const { refetchSharedBoard } = props
    const toast = useToast()
    const { data: session } = useSession()
    const [selectedBoard] = useAtom(BoardAtom)

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
        refetchOnWindowFocus: false,
        noLoading: true,
    })

    const optionsUser = useMemo(() => {
        if (!data || !session || !session.user) return []
        const userList = data
            .filter((user) => user.email !== session.user!.email)
            .map((d) => ({
                label: `${d.email} (${d.name})`,
                value: d.email!,
            }))
        if (!inputText) return userList
        return [{ label: inputText, value: inputText }, ...userList]
    }, [data, inputText])

    const { mutateAsync: mutateAddAsync } = useTableauMutation(
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
                })
            window.setTimeout(() => {
                refetchSharedBoard()
            })
        })
    }, [
        selectedRole,
        selectedUser,
        selectedBoard,
        mutateAddAsync,
        refetchSharedBoard,
        toast,
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
            >
                <Select
                    size="sm"
                    components={{
                        DropdownIndicator: () => null,
                        IndicatorSeparator: () => null,
                    }}
                    inputValue={inputText}
                    onInputChange={(val, actionMeta) => {
                        if (
                            actionMeta.action === 'input-blur' ||
                            actionMeta.action === 'menu-close'
                        )
                            return
                        setInputText(val)
                        setSelectedUser({ label: val, value: val })
                    }}
                    onChange={(val) => setSelectedUser(val as IOptionsMenuItem)}
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
                            background: 'white',
                            color: 'black',
                            '&:hover': {
                                background: 'teal.400',
                                color: 'white',
                            },
                        }),
                        menuList: (provided) => ({
                            ...provided,
                            zIndex: 100,
                            p: '8px',
                            border: 'solid 1px lightgray',
                            borderRadius: '10px',
                            width: '250px',
                            maxHeight: '550px',
                            bgColor: 'white',
                        }),
                    }}
                />
                <Select
                    onChange={(val) => setSelectedRole(val as IOptionsMenuItem)}
                    defaultValue={optionsRole[3]}
                    size="sm"
                    components={{ Option }}
                    options={optionsRole}
                    isSearchable={false}
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
                            border: 'solid 1px lightgray',
                            borderRadius: '10px',
                            width: '250px',
                            maxHeight: '550px',
                            bgColor: 'white',
                        }),
                    }}
                />
                <Button
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
