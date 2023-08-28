import React from 'react'
import { Button, ButtonGroup } from '@chakra-ui/react'
import { BsTrashFill } from 'react-icons/bs'

interface ITaskEditFormFooter {
    onOpenModal: () => void
    onClose: () => void
}

export function TaskEditFormFooter(props: ITaskEditFormFooter) {
    const { onClose, onOpenModal } = props
    return (
        <ButtonGroup
            display="flex"
            flex="0"
            justifyContent="space-between"
            my="3"
        >
            <ButtonGroup display="flex" justifyContent="flex-start">
                <Button
                    data-cy="buttonEditDelete"
                    onClick={() => onOpenModal()}
                    leftIcon={<BsTrashFill />}
                    colorScheme="red"
                    mr={1}
                >
                    Delete
                </Button>
            </ButtonGroup>
            <ButtonGroup display="flex" justifyContent="flex-end">
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    data-cy="buttonEditSave"
                    type="submit"
                    colorScheme="teal"
                    mr={1}
                >
                    Save
                </Button>
            </ButtonGroup>
        </ButtonGroup>
    )
}
