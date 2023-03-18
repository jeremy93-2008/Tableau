import React, { ChangeEvent, LegacyRef, useCallback, useState } from 'react'
import { AlertDialog } from '@chakra-ui/modal'
import {
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Button,
} from '@chakra-ui/react'
import { FocusableElement } from '@chakra-ui/utils'
import { TextInput } from '../../textInput'

interface ITaskEditFormModalInputProps {
    title: string
    description: string
    isOpen: boolean
    onClose: () => void
    onSubmit: (value: string) => void
}

export function InputModal(props: ITaskEditFormModalInputProps) {
    const { title, description, isOpen, onClose, onSubmit } = props
    const cancelRef = React.useRef<FocusableElement | null>(null)

    const [value, setValue] = useState('')

    const handleChange = useCallback((evt: ChangeEvent<HTMLElement>) => {
        setValue((evt.target as HTMLInputElement).value)
    }, [])

    return (
        <AlertDialog
            isOpen={isOpen}
            onClose={onClose}
            leastDestructiveRef={cancelRef}
        >
            <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader fontSize="lg" fontWeight="bold">
                        {title}
                    </AlertDialogHeader>

                    <AlertDialogBody>
                        <TextInput
                            name="inputValue"
                            label={description}
                            value={value}
                            onChange={handleChange}
                            onBlur={handleChange}
                        />
                    </AlertDialogBody>

                    <AlertDialogFooter>
                        <Button
                            ref={
                                cancelRef as
                                    | LegacyRef<HTMLButtonElement>
                                    | undefined
                            }
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            data-cy="modalInputButton"
                            colorScheme="teal"
                            onClick={() => onSubmit(value)}
                            ml={3}
                        >
                            Save
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    )
}
