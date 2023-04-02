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
    useToast,
    Text,
} from '@chakra-ui/react'
import { FocusableElement } from '@chakra-ui/utils'
import { TextInput } from '../../textInput'
import { z, ZodSchema } from 'zod'

interface ITaskEditFormModalInputProps {
    title: string
    description: string
    isOpen: boolean
    onClose: () => void
    onSubmit: (value: string) => void
    defaultValue?: string
    validationValueSchema?: ZodSchema<any>
}

export function InputModal(props: ITaskEditFormModalInputProps) {
    const {
        title,
        description,
        isOpen,
        onClose,
        onSubmit,
        defaultValue,
        validationValueSchema,
    } = props
    const inputRef = React.useRef<FocusableElement | null>(null)

    const [value, setValue] = useState(defaultValue ?? '')

    const [hasError, setHasError] = useState(false)
    const [errorMessages, setErrorMessages] = useState<string>('')
    const toast = useToast()

    const handleChange = useCallback(
        (evt: ChangeEvent<HTMLElement>) => {
            if (
                validationValueSchema?.safeParse(
                    (evt.target as HTMLInputElement).value
                ).success
            ) {
                setHasError(false)
                setErrorMessages('')
            }
            setValue((evt.target as HTMLInputElement).value)
        },
        [validationValueSchema]
    )

    useEffect(() => {
        setValue(defaultValue ?? '')
    }, [defaultValue, isOpen])

    const handleOnSubmit = useCallback(() => {
        const parse = validationValueSchema?.safeParse(value)
        if (parse && !parse.success) {
            const message = parse.error.issues
                .map((issue) => issue.message)
                .join('\\n')
            setHasError(true)
            setErrorMessages(message)
            if (toast.isActive('invalid-input')) return
            return toast({
                id: 'invalid-input',
                title: 'Invalid input',
                description: message,
                status: 'error',
                duration: 3000,
                isClosable: true,
            })
        }
        onSubmit(value)
    }, [onSubmit, toast, validationValueSchema, value])

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
                            style={
                                hasError ? { border: 'solid 1px #F56565' } : {}
                            }
                        />
                        {hasError && errorMessages && (
                            <Text mt={2} ml={2} color="#F56565">
                                {errorMessages}
                            </Text>
                        )}
                    </AlertDialogBody>

                    <AlertDialogFooter>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button
                            data-cy="modalInputButton"
                            colorScheme={hasError ? 'red' : 'teal'}
                            onClick={handleOnSubmit}
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
