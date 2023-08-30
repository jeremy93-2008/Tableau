import React, {
    ChangeEventHandler,
    FocusEventHandler,
    forwardRef,
    LegacyRef,
} from 'react'
import { FormControl, FormLabel, Input, Textarea } from '@chakra-ui/react'

interface ITextInputProps<TValue> {
    name: string
    label: string
    value: TValue
    onChange: ChangeEventHandler<HTMLElement>
    onBlur: FocusEventHandler<HTMLElement>
    onEnter?: () => void
    min?: number
    max?: number
    type?: 'text' | 'textarea' | 'number'
    placeholder?: string
    style?: React.CSSProperties
}

export const TextInput = forwardRef<HTMLElement, ITextInputProps<string>>(
    (props, ref) => {
        const {
            name,
            label,
            placeholder,
            min,
            max,
            value,
            onBlur,
            onChange,
            onEnter,
            type,
            style,
        } = props

        return (
            <FormControl>
                <FormLabel htmlFor={name}>{label}</FormLabel>
                {(!type || type === 'text') && (
                    <Input
                        ref={ref as LegacyRef<HTMLInputElement>}
                        colorScheme="teal"
                        value={value as string}
                        placeholder={placeholder}
                        onChange={onChange}
                        onBlur={onBlur}
                        onKeyDown={(evt) => {
                            if (evt.key === 'Enter' && onEnter) {
                                onEnter()
                            }
                        }}
                        name={name}
                        style={style}
                    />
                )}
                {type && type === 'textarea' && (
                    <Textarea
                        ref={ref as LegacyRef<HTMLTextAreaElement>}
                        colorScheme="teal"
                        value={value as string}
                        placeholder={placeholder}
                        onChange={onChange}
                        onBlur={onBlur}
                        onKeyDown={(evt) => {
                            if (
                                !evt.shiftKey &&
                                evt.key === 'Enter' &&
                                onEnter
                            ) {
                                evt.preventDefault()
                                onEnter()
                            }
                        }}
                        name={name}
                        style={style}
                    />
                )}
                {type && type === 'number' && (
                    <Input
                        ref={ref as LegacyRef<HTMLInputElement>}
                        colorScheme="teal"
                        type="number"
                        min={min}
                        max={max}
                        value={value as string}
                        placeholder={placeholder}
                        onChange={onChange}
                        onBlur={onBlur}
                        onKeyDown={(evt) => {
                            if (evt.key === 'Enter' && onEnter) {
                                onEnter()
                            }
                        }}
                        name={name}
                        style={style}
                    />
                )}
            </FormControl>
        )
    }
)
TextInput.displayName = 'TextInput'
