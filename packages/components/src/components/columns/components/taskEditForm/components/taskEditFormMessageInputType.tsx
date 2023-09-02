import React, { Ref, useEffect, useRef } from 'react'
import autosize from 'autosize'
import { Button } from '@chakra-ui/react'
import { IoIosSend } from 'react-icons/io'
import { TextInput } from '../../../../textInput'

interface TaskEditFormMessageInputTypeProps {
    value: string
    onChange: (newValue: string) => void
    onSend: () => void
}

export function TaskEditFormMessageInputType(
    props: TaskEditFormMessageInputTypeProps
) {
    const { value, onChange, onSend } = props
    const refMessage = useRef()

    useEffect(() => {
        const textAreaElement = refMessage.current
        if (!textAreaElement) return
        autosize(textAreaElement)
        return () => {
            autosize.destroy(textAreaElement)
        }
    }, [value])

    return (
        <>
            <TextInput
                id="comments-input"
                ref={refMessage as unknown as Ref<HTMLElement>}
                name="messagetype"
                label="Type a message"
                type="textarea"
                value={value}
                onChange={(evt) =>
                    onChange((evt.target as HTMLTextAreaElement).value)
                }
                onBlur={() => {}}
                onEnter={onSend}
                style={{
                    resize: 'none',
                    minHeight: '40px',
                }}
            />
            <Button
                onClick={onSend}
                aria-label="Send the message"
                leftIcon={<IoIosSend />}
                size="md"
            >
                Send
            </Button>
        </>
    )
}
