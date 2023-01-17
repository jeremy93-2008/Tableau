import React, { forwardRef, RefObject } from 'react'
import { FormControl, FormLabel, Input } from '@chakra-ui/react'

export const TextInput = forwardRef(
    (
        props: {
            id: string
            label: string
            defaultValue?: string
            placeholder?: string
        },
        ref
    ) => {
        return (
            <FormControl>
                <FormLabel htmlFor={props.id}>{props.label}</FormLabel>
                <Input ref={ref as RefObject<HTMLInputElement>} {...props} />
            </FormControl>
        )
    }
)

TextInput.displayName = 'TextInput'
