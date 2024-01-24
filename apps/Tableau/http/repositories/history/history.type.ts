import { TaskHistoryMessageCode } from 'shared-utils/src/constants/taskHistoryMessageCode'

export namespace IHistory {
    export interface AddHistory {
        taskId: string
        code: TaskHistoryMessageCode
        params: Record<string, string>
        email: string
    }
}
