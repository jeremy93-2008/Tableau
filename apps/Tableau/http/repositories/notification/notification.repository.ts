import { Prisma } from '@prisma/client'
import prisma from '../../../lib/prisma'

export class NotificationRepository {
    private notificationTable: Prisma.NotificationDelegate<
        Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
    >
    constructor() {
        this.notificationTable = prisma.notification
    }

    async add(
        type: 'error' | 'warning' | 'info' | 'success',
        message: string,
        emails: string[]
    ) {
        return this.notificationTable.create({
            data: {
                message,
                type,
                Users: {
                    connect: emails.map((email) => ({ email })),
                },
            },
        })
    }
}
