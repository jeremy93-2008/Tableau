import {
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Button,
} from '@chakra-ui/react'
import React, { Ref, useCallback, useEffect, useMemo, useState } from 'react'
import { AlertDialog } from '@chakra-ui/modal'
import { FocusableElement } from '@chakra-ui/utils'
import { ZodSchema } from 'zod'
import { SafeParseError } from 'zod/lib/types'
import { ZodError } from 'zod/lib/ZodError'

interface IFormModalProps<TValues extends Object> {
    title: string
    isOpen: boolean
    defaultValues: TValues
    validationSchema?: ZodSchema<TValues>
    onClose: () => void
    onSubmit: (values: TValues) => void
    children: ({
        values,
        onFieldChange,
    }: {
        values: TValues
        onFieldChange: (field: keyof TValues, value: string) => void
        error: ZodError<TValues>
    }) => React.ReactNode
}
export function FormModal<TValues extends Object>(
    props: IFormModalProps<TValues>
) {
    const {
        title,
        defaultValues,
        validationSchema,
        isOpen,
        onSubmit,
        onClose,
        children,
    } = props
    const inputRef = React.useRef<FocusableElement | null>(null)

    const [values, setValues] = useState(defaultValues ?? '')

    const validate = useMemo(() => {
        return validationSchema?.safeParse(values)
    }, [validationSchema, values])

    const error = useMemo(() => {
        return (validate as SafeParseError<TValues>).error
    }, [validate])

    const onFieldChange = useCallback((field: keyof TValues, value: any) => {
        setValues((prev) => ({ ...prev, [field]: value }))
    }, [])

    const handleOnSubmit = () => {}

    useEffect(() => {
        if (isOpen) return
        setValues(defaultValues)
    }, [defaultValues, isOpen])

    return (
        <AlertDialog
            leastDestructiveRef={inputRef}
            isOpen={isOpen}
            onClose={onClose}
        >
            <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader fontSize="lg" fontWeight="bold">
                        {title}
                    </AlertDialogHeader>

                    <AlertDialogBody>
                        {children({
                            values,
                            onFieldChange,
                            error,
                        })}
                    </AlertDialogBody>

                    <AlertDialogFooter>
                        <Button
                            ref={inputRef as Ref<HTMLButtonElement> | undefined}
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            data-cy="modalFormButton"
                            colorScheme="teal"
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
