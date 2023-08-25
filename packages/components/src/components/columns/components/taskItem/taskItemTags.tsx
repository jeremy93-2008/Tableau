import { Badge, Flex, Tooltip } from '@chakra-ui/react'
import React from 'react'
import { IFullTask } from 'shared-types'

interface ITaskItemTagsProps {
    task: IFullTask
}

export function TaskItemTags(props: ITaskItemTagsProps) {
    const { task } = props
    return (
        <>
            {task.tags.length > 0 && (
                <Flex flexWrap="wrap">
                    {task.tags.map((tag) => (
                        <Tooltip
                            key={tag.id}
                            label={tag.name}
                            aria-label={tag.name}
                        >
                            <Badge
                                data-cy="taskTag"
                                mr={1}
                                mb={1}
                                variant="solid"
                                backgroundColor={tag.color}
                            >
                                {tag.name}
                            </Badge>
                        </Tooltip>
                    ))}
                </Flex>
            )}
        </>
    )
}
