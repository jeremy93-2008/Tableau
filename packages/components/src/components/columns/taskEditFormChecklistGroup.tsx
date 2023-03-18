import { IFullCheckListGroup } from 'shared-types'
import { Button, Flex, Text } from '@chakra-ui/react'
import React from 'react'
import { MdChecklist } from 'react-icons/md'
import { AddIcon } from '@chakra-ui/icons'

interface ITaskEditFormChecklistGroupProps {
    checklistGroup: IFullCheckListGroup
}
export function TaskEditFormChecklistGroup(
    props: ITaskEditFormChecklistGroupProps
) {
    const { checklistGroup } = props
    return (
        <Flex flexDirection="column">
            <Flex alignItems="center">
                <MdChecklist size={18} />
                <Text ml={2}>{checklistGroup.name}</Text>
            </Flex>
            <Flex alignItems="center" mt={1} mb={2} ml={6}>
                <Button size="xs" leftIcon={<AddIcon />}>
                    Add Item
                </Button>
            </Flex>
        </Flex>
    )
}
