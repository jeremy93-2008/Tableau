import prisma from '../../lib/prisma'
import { NextApiRequest } from 'next'

export async function getBoardIdFromTaskId(id: string) {
    return (await prisma.task.findFirst({
        where: { id },
    }))!.boardId
}
