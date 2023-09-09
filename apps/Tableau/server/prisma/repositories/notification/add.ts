import prisma from '../../../../lib/prisma'

export async function addNotification(
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
