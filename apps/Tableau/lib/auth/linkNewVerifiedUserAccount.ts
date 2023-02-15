import prisma from '../database/prisma'
import { AdapterUser } from 'next-auth/adapters'
import { Account, User } from 'next-auth'

export async function linkNewVerifiedUserAccount({
    user,
    account,
}: {
    user: User | AdapterUser
    account: Account | null
}) {
    if (!user || !account) return false

    const currentUser = await prisma.user.findFirst({
        where: { email: user.email! },
    })

    const currentAccount = currentUser
        ? await prisma.account.findFirst({
              where: { user: { email: currentUser.email } },
          })
        : false

    const hasUser = !!currentUser

    if (hasUser && !currentAccount && currentUser.image == 'to_link') {
        await prisma.$transaction([
            prisma.user.update({
                where: {
                    email: user.email!,
                },
                data: {
                    name: user.name,
                    image: user.image,
                },
            }),
            prisma.account.create({
                data: {
                    provider: account.provider,
                    type: account.type,
                    providerAccountId: account.providerAccountId,
                    access_token: account.access_token,
                    id_token: account.id_token,
                    scope: account.scope,
                    expires_at: account.expires_at,
                    token_type: account.token_type,
                    user: { connect: { email: user.email! } },
                },
            }),
        ])
        return true
    }

    return true
}
