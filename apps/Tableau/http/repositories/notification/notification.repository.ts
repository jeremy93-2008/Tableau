import { Prisma } from '@prisma/client'
import prisma from '../../../lib/prisma'

export class Notification {
    public static async add(
        type: 'error' | 'warning' | 'info' | 'success',
        message: string,
        emails: string[]
    ) {
        return prisma.notification.create({
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
