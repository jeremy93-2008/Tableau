import prisma from '../../../lib/prisma'
import { Prisma } from '@prisma/client'
import { IHistory } from './history.type'

export class History {
    public static async add({
        taskId,
        code,
        params,
        email,
    }: IHistory.AddHistory) {
        return prisma.history.create({
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
