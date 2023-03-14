import { IFullCheckListGroup } from '../../types/types'
import { Flex } from '@chakra-ui/react'

interface ITaskEditFormChecklistGroupProps {
    checklistGroup: IFullCheckListGroup
}
export function TaskEditFormChecklistGroup(
    props: ITaskEditFormChecklistGroupProps
) {
    const { checklistGroup } = props
    return <Flex>{checklistGroup.name}</Flex>
}
