import React, {
    ChangeEvent,
    Ref,
    useCallback,
    useEffect,
    useMemo,
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
    Flex,
    Text,
} from '@chakra-ui/react'
import { FocusableElement } from '@chakra-ui/utils'
import { TextInput } from '../../textInput'
import { z, ZodSchema } from 'zod'
import { SafeParseError } from 'zod/lib/types'

interface ITaskEditFormModalInputProps {
    title: string
    description: string | string[]
    isOpen: boolean
    onClose: () => void
    onSubmit: (value: string[]) => void
    defaultValue?: string | string[]
    validationValueSchema?: Array<ZodSchema<any>>
}

export function InputModal(props: ITaskEditFormModalInputProps) {
    const {
        title,
        description: rawDescription,
        isOpen,
        onClose,
        onSubmit,
        defaultValue: rawDefaultValue,
        validationValueSchema,
    } = props

    const description = Array.isArray(rawDescription)
        ? rawDescription
        : [rawDescription]

    const defaultValue = useMemo(
        () =>
            Array.isArray(rawDefaultValue)
                ? rawDefaultValue
                : [rawDefaultValue || ''],
        [rawDefaultValue]
    )

    const inputRef = React.useRef<FocusableElement | null>(null)

    const [value, setValue] = useState(defaultValue ?? [])

    const [hasErrors, setHasError] = useState<boolean[]>([])
    const [errorMessages, setErrorMessages] = useState<string[]>([])

    const handleChange = useCallback(
        (evt: ChangeEvent<HTMLElement>, idx: number) => {
            setValue((prevState) => {
                const newState = [...prevState]
                newState[idx] = (evt.target as HTMLInputElement).value

                const success = validationValueSchema?.every(
                    (zodSchema) => zodSchema.safeParse(value[idx]).success
                )

                if (success) {
                    setHasError([])
                    setErrorMessages([])
                }

                return structuredClone(newState)
            })
        },
        [validationValueSchema, value]
    )

    useEffect(() => {
        if (isOpen) return
        setValue(defaultValue ?? '')
        setHasError([])
        setErrorMessages([])
    }, [defaultValue, isOpen])

    const handleOnSubmit = useCallback(() => {
        const parseSchema = validationValueSchema?.map((zodSchema, idx) =>
            zodSchema.safeParse(value[idx])
        )
        const success = parseSchema?.every((parse) => parse?.success)

        if (parseSchema && !success) {
            const messages: string[] = parseSchema.map(
                (parse) =>
                    (parse as SafeParseError<any>)?.error?.errors
                        .map((err) => err.message)
                        .join('\n') ?? ''
            )
            setHasError(messages.map((message) => !!message))
            setErrorMessages(messages)
            return
        } else {
            setHasError([])
            setErrorMessages([])
        }

        onSubmit(value)
    }, [onSubmit, validationValueSchema, value])

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
                        {value.map((val, idx) => (
                            <Flex
                                key={idx}
                                flexDirection="column"
                                mt={idx > 0 ? 4 : 0}
                            >
                                <TextInput
                                    ref={
                                        idx === 0
                                            ? (inputRef as
                                                  | Ref<HTMLInputElement>
                                                  | undefined)
                                            : undefined
                                    }
                                    name={'inputValue-' + idx}
                                    label={description[idx]}
                                    value={val}
                                    onEnter={() => {
                                        if (value.length === idx + 1)
                                            handleOnSubmit()
                                    }}
                                    onChange={(evt) => handleChange(evt, idx)}
                                    onBlur={(evt) => handleChange(evt, idx)}
                                    style={
                                        hasErrors[idx]
                                            ? { border: 'solid 1px #F56565' }
                                            : {}
                                    }
                                />
                                {hasErrors && errorMessages && (
                                    <Text
                                        mt={2}
                                        ml={2}
                                        whiteSpace="pre"
                                        color="#F56565"
                                    >
                                        {errorMessages[idx] ?? ''}
                                    </Text>
                                )}
                            </Flex>
                        ))}
                    </AlertDialogBody>

                    <AlertDialogFooter>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button
                            data-cy="modalInputButton"
                            colorScheme={hasErrors.length > 0 ? 'red' : 'teal'}
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
