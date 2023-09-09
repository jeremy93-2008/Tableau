import prisma from '../../../../lib/prisma'
import { Prisma } from '@prisma/client'
import { TaskHistoryMessageCode } from 'shared-utils/src/constants/taskHistoryMessageCode'

interface AddHistory {
    taskId: string
    code: TaskHistoryMessageCode
    params: Record<string, string>
    email: string
}

export class HistoryRepository {
    private historyTable: Prisma.HistoryDelegate<
        Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
    >
    constructor() {
        this.historyTable = prisma.history
    }

    async addHistory({ taskId, code, params, email }: AddHistory) {
        return this.historyTable.create({
            data: {
                messageCode: code,
                messageParams: {
                    create: Object.entries(params).map(([name, value]) => ({
                        name,
                        value,
                    })),
                },
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
