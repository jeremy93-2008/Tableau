import React from 'react'
import { Flex } from '@chakra-ui/react'
import { IFullTask } from 'shared-types'
import { FormikProps } from 'formik'
import { ITaskEditFormikValues } from '../../../taskEdit'
import { TaskEditFormAssignedUser } from '../components/taskEditFormAssignedUser'
import { TaskEditFormTags } from '../components/taskEditFormTags'
import { TaskEditFormStartDueDate } from '../components/taskEditFormStartDueDate'
import { TaskEditFormNotification } from '../components/taskEditFormNotification'

interface ITaskEditFormHeaderProps {
    task: IFullTask
    form: FormikProps<ITaskEditFormikValues>
}

export function TaskEditFormHeader(props: ITaskEditFormHeaderProps) {
    const { task, form } = props

    return (
        <>
            <Flex mb={2} flexDirection="row" justifyContent="space-between">
                <TaskEditFormTags task={task} />
            </Flex>
            <Flex mb={2} flexDirection="row" justifyContent="space-between">
                <TaskEditFormAssignedUser
                    assignedUsersIds={form.values.assignedUserIds}
                    setAssignedUser={(assignedUserIds: string[] | null) => {
                        form.setValues({
                            ...form.values,
                            assignedUserIds: assignedUserIds ?? undefined,
                        })
                    }}
                />
                <TaskEditFormStartDueDate
                    startDate={form.values.startDate}
                    endDate={form.values.endDate}
                    onChangeDate={(date: [Date?, Date?]) => {
                        const [startDate, endDate] = date
                        form.setValues({
                            ...form.values,
                            startDate,
                            endDate,
                        })
                    }}
                />
                <TaskEditFormNotification />
            </Flex>
        </>
    )
}
