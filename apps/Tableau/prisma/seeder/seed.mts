import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function populate() {
    await prisma.user.createMany({
        // @ts-ignore
        data: (await import('./data/User.json', { assert: { type: "json" } })).default,
    })
    await prisma.session.createMany({
        // @ts-ignore
        data: (await import('./data/Session.json', { assert: { type: "json" } })).default,
    })
    await prisma.account.createMany({
        // @ts-ignore
        data: (await import('./data/Account.json', { assert: { type: "json" } })).default,
    })
    await prisma.status.createMany({
        // @ts-ignore
        data: (await import('./data/Status.json', { assert: { type: "json" } })).default,
    })
    await prisma.board.createMany({
        // @ts-ignore
        data: (await import('./data/Board.json', { assert: { type: "json" } })).default,
    })
    await prisma.statusBoard.createMany({
        // @ts-ignore
        data: (await import('./data/StatusBoard.json', { assert: { type: "json" } })).default,
    })
    await prisma.verificationToken.createMany({
        // @ts-ignore
        data: (await import('./data/VerificationToken.json', { assert: { type: "json" } })).default,
    })
    await prisma.task.createMany({
        // @ts-ignore
        data: (await import('./data/Task.json', { assert: { type: "json" } })).default,
    })
    await prisma.notification.createMany({
        // @ts-ignore
        data: (await import('./data/Notification.json', { assert: { type: "json" } })).default,
    })
    await prisma.boardUserSharing.createMany({
        // @ts-ignore
        data: (await import('./data/BoardUserSharing.json', { assert: { type: "json" } })).default,
    })
    await prisma.taskAssignedUser.createMany({
        // @ts-ignore
        data: (await import('./data/TaskAssignedUser.json', { assert: { type: "json" } })).default,
    })
    await prisma.checklistGroup.createMany({
        // @ts-ignore
        data: (await import('./data/ChecklistGroup.json', { assert: { type: "json" } })).default,
    })
    await prisma.checklist.createMany({
        // @ts-ignore
        data: (await import('./data/Checklist.json', { assert: { type: "json" } })).default,
    })
    await prisma.link.createMany({
        // @ts-ignore
        data: (await import('./data/Link.json', { assert: { type: "json" } })).default,
    })
    await prisma.notification.createMany({
        // @ts-ignore
        data: (await import('./data/Notification.json', { assert: { type: "json" } })).default,
    })
    await prisma.tag.createMany({
        // @ts-ignore
        data: (await import('./data/Tag.json', { assert: { type: "json" } })).default,
    })
}

async function main() {
    await prisma.$transaction(async () => {
        await populate()
    })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })

    .catch(async (e) => {
        console.error(e)

        await prisma.$disconnect()

        process.exit(1)
    })
