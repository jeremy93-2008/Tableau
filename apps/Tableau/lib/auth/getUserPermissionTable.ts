import prisma from '../database/prisma'
import { Session } from 'next-auth'

export async function getUserPermissionTable(session: Session) {
    return prisma && session
        ? await prisma.boardUserSharing.findMany({
              where: {
                  user: { email: session.user!.email },
              },
          })
        : []
}
