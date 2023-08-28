import { Flex } from '@chakra-ui/react'
import { IFullTask } from 'shared-types'
import { TaskEditFormMessage } from '../../components/taskEditFormMessage'
import { FormikProps } from 'formik'
import { ITaskEditFormikValues } from '../../../../taskEdit'
import { TextInput } from '../../../../../textInput'

interface ITaskEditFormCommentsProps {
    task: IFullTask
    form: FormikProps<ITaskEditFormikValues>
}

export function TaskEditFormComments(props: ITaskEditFormCommentsProps) {
    const { task } = props
    return (
        <Flex flexDirection="column" maxH="65vh" minH="10vw">
            <Flex flexDirection="column" flex={1}>
                {task.Comment.map((comment) => (
                    <TaskEditFormMessage key={comment.id} comment={comment} />
                ))}
            </Flex>
            <TextInput
                name="messagetype"
                label="Type a message"
                value=""
                onChange={() => {}}
                onBlur={() => {}}
            />
        </Flex>
    )
}
