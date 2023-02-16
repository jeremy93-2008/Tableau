import prisma from '../../lib/prisma'

export async function getBoardIdFromStatusId(id: string) {
    return (await prisma.statusBoard.findFirst({
        where: { id },
    }))!.boardId
}
