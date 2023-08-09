import { Session } from 'next-auth'
import prisma from '../../../../../lib/prisma'

export async function deleteExpiredSession(session: Session) {
    return prisma.session.deleteMany({
        where: {
            user: {
                email: session.user.email,
            },
            expires: {
                lt: new Date(),
            },
        },
    })
}
