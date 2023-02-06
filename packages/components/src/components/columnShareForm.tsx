import { Avatar, CloseButton, Flex, Text } from '@chakra-ui/react'
import { IFullBoardSharing } from 'tableau/types/types'
import { IBoardWithAllRelation } from '../types/types'
import React from 'react'
import { Select } from 'chakra-react-select'

interface IColumnShareFormProps {
    selectedBoard: IBoardWithAllRelation
    boardsSharedUser: IFullBoardSharing[]
}

export function ColumnShareForm(props: IColumnShareFormProps) {
    const { selectedBoard, boardsSharedUser } = props
    return (
        <Flex>
            {selectedBoard &&
                boardsSharedUser &&
                boardsSharedUser.map((boardShared, idx) => {
                    return (
                        <Flex
                            key={boardShared.id}
                            justifyContent="space-around"
                            gap={4}
                            alignItems="center"
                        >
                            <Avatar
                                name={boardShared.user.email!}
                                src={boardShared.user.image!}
                                size="sm"
                                zIndex={boardsSharedUser.length - idx}
                                ml={idx > 0 ? -4 : 0}
                                _hover={{ ml: 0 }}
                                cursor="pointer"
                                border={
                                    boardShared.userId === selectedBoard?.userId
                                        ? 'solid 3px teal'
                                        : ''
                                }
                            />
                            <Flex gap={2}>
                                <Text fontWeight="medium">
                                    {boardShared.user.name}
                                </Text>
                                <Text>({boardShared.user.email})</Text>
                            </Flex>
                            <Flex gap={2}>
                                <Select
                                    colorScheme="teal"
                                    selectedOptionColor="teal"
                                    size="sm"
                                    options={[
                                        {
                                            label: 'Administrator',
                                            value: 'admin',
                                        },
                                        {
                                            label: 'Editor',
                                            value: 'editor',
                                        },
                                        {
                                            label: 'Observer',
                                            value: 'editor',
                                        },
                                    ]}
                                    chakraStyles={{
                                        container: (provided) => ({
                                            ...provided,
                                            width: '150px',
                                        }),
                                    }}
                                />
                            </Flex>
                            <Flex>
                                <CloseButton />
                            </Flex>
                        </Flex>
                    )
                })}
        </Flex>
    )
}
