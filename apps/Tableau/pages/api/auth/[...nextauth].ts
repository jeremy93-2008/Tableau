import NextAuth, { AuthOptions, SessionStrategy } from 'next-auth'
import Auth0Provider from 'next-auth/providers/auth0'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import prisma from '../../../lib/prisma'
import { randomBytes, randomUUID } from 'crypto'
import { linkNewVerifiedUserAccount } from '../../../lib/linkNewVerifiedUserAccount'

export const authOptions: AuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        Auth0Provider({
            clientId: process.env.AUTH0_CLIENT_ID!,
            clientSecret: process.env.AUTH0_CLIENT_SECRET!,
            issuer: process.env.AUTH0_ISSUER,
        }),
    ],
    callbacks: {
        signIn: linkNewVerifiedUserAccount,
    },
    session: {
        // Choose how you want to save the user session.
        // The default is `"jwt"`, an encrypted JWT (JWE) stored in the session cookie.
        // If you use an `adapter` however, we default it to `"database"` instead.
        // You can still force a JWT session by explicitly defining `"jwt"`.
        // When using `"database"`, the session cookie will only contain a `sessionToken` value,
        // which is used to look up the session in the database.
        strategy: 'database' as SessionStrategy,

        // Seconds - How long until an idle session expires and is no longer valid.
        maxAge: 30 * 24 * 60 * 60, // 30 days

        // Seconds - Throttle how frequently to write to database to extend a session.
        // Use it to limit write operations. Set to 0 to always update the database.
        // Note: This option is ignored if using JSON Web Tokens
        updateAge: 24 * 60 * 60, // 24 hours

        // The session token is usually either a random UUID or string, however if you
        // need a more customized session token string, you can define your own generate function.
        generateSessionToken: () => {
            return randomUUID?.() ?? randomBytes(32).toString('hex')
        },
    },
}

export default NextAuth(authOptions)
