import prisma from '../../../../lib/prisma'
import { Prisma } from '@prisma/client'
import { TaskHistoryMessageCode } from 'shared-utils/src/constants/taskHistoryMessageCode'

interface AddHistory {
    taskId: string
    type: TaskHistoryMessageCode
    params: string[]
    email: string
}

export class HistoryRepository {
    private historyTable: Prisma.HistoryDelegate<
        Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
    >
    constructor() {
        this.historyTable = prisma.history
    }

    async addHistory({ taskId, type, params, email }: AddHistory) {
        return this.historyTable.create({
            data: {
                message: `${type},${params.join(',')}`,
                task: {
                    connect: {
                        id: taskId,
                    },
                },
                user: {
                    connect: {
                        email,
                    },
                },
            },
        })
    }
}
