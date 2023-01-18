import React, { ChangeEventHandler, FocusEventHandler } from 'react'
import { FormControl, FormLabel, Input } from '@chakra-ui/react'

interface ITextInputProps {
    name: string
    label: string
    value: string
    onChange: ChangeEventHandler<HTMLInputElement>
    onBlur: FocusEventHandler<HTMLInputElement>
    placeholder?: string
    style?: React.CSSProperties
}

export function TextInput(props: ITextInputProps) {
    const { name, label, placeholder, value, onBlur, onChange, style } = props
    return (
        <FormControl>
            <FormLabel htmlFor={name}>{label}</FormLabel>
            <Input
                value={value}
                placeholder={placeholder}
                onChange={onChange}
                onBlur={onBlur}
                name={name}
                style={style}
            />
        </FormControl>
    )
}
