import { Button, Flex, Text } from '@chakra-ui/react'
import { Select } from 'chakra-react-select'
import React, { useMemo, useState } from 'react'
import { useShareRolesOptions } from './hooks/useShareRolesOptions'
import { useAtom } from 'jotai'
import { BoardAtom } from 'shared-atoms'
import { FaUserPlus } from 'react-icons/fa'
import { useTableauQuery } from 'shared-hooks'
import { User } from '.prisma/client'

export function ColumnShareFormNew() {
    const [selectedBoard] = useAtom(BoardAtom)

    const [inputText, setInputText] = useState('')
    const { data } = useTableauQuery<User[]>(['api/user/list'], {
        refetchOnWindowFocus: false,
    })

    const optionsUser = useMemo(() => {
        if (!data) return []
        const userList = data.map((d) => ({
            label: `${d.email} (${d.name})`,
            value: d.email!,
        }))
        if (!inputText) return userList
        return [{ label: inputText, value: inputText }, ...userList]
    }, [data, inputText])

    const { Option, options: optionsRole } = useShareRolesOptions(
        selectedBoard!
    )
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
                    onInputChange={(val) => setInputText(val)}
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
                <Button colorScheme="teal" leftIcon={<FaUserPlus />}>
                    Invite
                </Button>
            </Flex>
        </Flex>
    )
}
