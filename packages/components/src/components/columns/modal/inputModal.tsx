import React, {
    ChangeEvent,
    Ref,
    useCallback,
    useEffect,
    useState,
} from 'react'
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
    defaultValue?: string
}

export function InputModal(props: ITaskEditFormModalInputProps) {
    const { title, description, isOpen, onClose, onSubmit, defaultValue } =
        props
    const inputRef = React.useRef<FocusableElement | null>(null)

    const [value, setValue] = useState(defaultValue ?? '')

    const handleChange = useCallback((evt: ChangeEvent<HTMLElement>) => {
        setValue((evt.target as HTMLInputElement).value)
    }, [])

    useEffect(() => {
        setValue(defaultValue ?? '')
    }, [defaultValue, isOpen])

    return (
        <AlertDialog
            isOpen={isOpen}
            onClose={onClose}
            leastDestructiveRef={inputRef}
        >
            <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader fontSize="lg" fontWeight="bold">
                        {title}
                    </AlertDialogHeader>

                    <AlertDialogBody>
                        <TextInput
                            ref={inputRef as Ref<HTMLInputElement> | undefined}
                            name="inputValue"
                            label={description}
                            value={value}
                            onEnter={() => onSubmit(value)}
                            onChange={handleChange}
                            onBlur={handleChange}
                        />
                    </AlertDialogBody>

                    <AlertDialogFooter>
                        <Button onClick={onClose}>Cancel</Button>
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
