import prisma from '../../../lib/prisma'
import { Prisma } from '@prisma/client'
import { IHistory } from './history.type'

export class HistoryRepository {
    private historyTable: Prisma.HistoryDelegate<
        Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
    >

    constructor() {
        this.historyTable = prisma.history
    }

    async add({ taskId, code, params, email }: IHistory.AddHistory) {
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
