import { NextApiRequest, NextApiResponse } from 'next'
import { AuthOptions } from 'next-auth'
import { Prisma, PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth/next'

export async function addShareablePermissionCb(options: {
    req: NextApiRequest
    res: NextApiResponse
    authOptions: AuthOptions
    prisma: PrismaClient<
        Prisma.PrismaClientOptions,
        never,
        Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
    >
}) {
    const { res, req, prisma, authOptions } = options
    const boardId = req.body.boardId as string
    const session = await getServerSession(req, res, authOptions)

    if (!session || !session.user) return false

    // We retrieve the row of sharing permissions for the current user
    // (flaw: We don't check the author of the current board,
    // and we expect to have all permissions on the table sharing)
    const boardUserSharing = await prisma.boardUserSharing.findFirst({
        where: { board: { id: boardId }, user: { email: session.user.email } },
    })

    if (!boardUserSharing) return false

    // Check if the current User have at least Administrator privilege
    return boardUserSharing.canEditSchema && boardUserSharing.canEditContent
}
