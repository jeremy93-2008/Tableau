import React, { ChangeEventHandler, FocusEventHandler } from 'react'
import { FormControl, FormLabel, Input, Textarea } from '@chakra-ui/react'

interface ITextInputProps<TValue> {
    name: string
    label: string
    value: TValue
    onChange: ChangeEventHandler<HTMLElement>
    onBlur: FocusEventHandler<HTMLElement>
    min?: number
    max?: number
    type?: 'text' | 'textarea' | 'number'
    placeholder?: string
    style?: React.CSSProperties
}

export function TextInput<TValue>(props: ITextInputProps<TValue>) {
    const {
        name,
        label,
        placeholder,
        min,
        max,
        value,
        onBlur,
        onChange,
        type,
        style,
    } = props
    return (
        <FormControl>
            <FormLabel htmlFor={name}>{label}</FormLabel>
            {(!type || type === 'text') && (
                <Input
                    colorScheme="teal"
                    value={value as string}
                    placeholder={placeholder}
                    onChange={onChange}
                    onBlur={onBlur}
                    name={name}
                    style={style}
                />
            )}
            {type && type === 'textarea' && (
                <Textarea
                    colorScheme="teal"
                    value={value as string}
                    placeholder={placeholder}
                    onChange={onChange}
                    onBlur={onBlur}
                    name={name}
                    style={style}
                />
            )}
            {type && type === 'number' && (
                <Input
                    colorScheme="teal"
                    type="number"
                    min={min}
                    max={max}
                    value={value as string}
                    placeholder={placeholder}
                    onChange={onChange}
                    onBlur={onBlur}
                    name={name}
                    style={style}
                />
            )}
        </FormControl>
    )
}
