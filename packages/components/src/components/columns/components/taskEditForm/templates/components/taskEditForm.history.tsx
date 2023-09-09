import { FormikProps } from 'formik'
import { IFullTask } from 'shared-types'
import { ITaskEditFormikValues } from '../../../../taskEdit'

interface ITaskEditFormCommentsProps {
    task: IFullTask
    form: FormikProps<ITaskEditFormikValues>
    isVisible: boolean
}
export function TaskEditFormHistory(props: ITaskEditFormCommentsProps) {
    const { task, isVisible } = props

    return (
        <div>
            {task.History.map((history) => (
                <div key={history.id}>{history.message}</div>
            ))}
        </div>
    )
}
