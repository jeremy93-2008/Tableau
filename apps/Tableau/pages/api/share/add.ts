import { NextApiRequest, NextApiResponse } from 'next'
import AWS from 'aws-sdk'
import prisma from '../../../lib/prisma'
import { authOptions } from '../auth/[...nextauth]'
import { addShareablePermissionCb } from 'shared-libs'
import { onCallExceptions } from '../../../server/next/exceptions/onCallExceptions'
import { z } from 'zod'
import { Authenticate } from '../../../server/next/auth/Authenticate'
import { Board } from '.prisma/client'
import { Session } from 'next-auth'
import { addNotification } from '../../../server/prisma/repositories/notification/add'
import { isAuthenticated } from '../../../server/next/auth/isAuthenticated'

type ISchemaParams = z.infer<typeof schema>

const schema = z.object({
    boardId: z.string().cuid(),
    email: z.string().email(),
    canEditSchema: z.boolean(),
    canEditContent: z.boolean(),
})

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await (
        await (
            await Authenticate.Post<typeof schema, ISchemaParams>(
                req,
                res,
                schema
            )
        ).checkAsync(async () => {
            return addShareablePermissionCb({
                req,
                res,
                authOptions,
                prisma,
            })
        })
    )
        .success(async (params) => {
            const { boardId, email, canEditSchema, canEditContent } = params

            const session = await isAuthenticated({ req, res, authOptions })

            const isUserAlreadyHasAccount = await prisma.user.findFirst({
                where: { email },
            })

            const result = await prisma.boardUserSharing.create({
                data: {
                    board: { connect: { id: boardId } },
                    user: {
                        connectOrCreate: {
                            where: { email },
                            create: {
                                name: email.split('@')[0],
                                email,
                                image: 'to_link',
                            },
                        },
                    },
                    canEditSchema,
                    canEditContent,
                },
            })

            const board = await prisma.board.findFirst({
                where: { id: boardId },
            })

            await addNotification(
                'info',
                'You have been invited to collaborate on a board (' +
                    board?.name +
                    ') by ' +
                    (session as Session).user.name,
                [email]
            )

            res.json({
                data: result,
                isUserAlreadyHasAccount: !!isUserAlreadyHasAccount,
            })
        })
        .catch((errors) => onCallExceptions(res, errors))
}

async function sendCollaborationMail(
    email: string,
    board: Board,
    session: Session
) {
    AWS.config.update({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: 'us-east-1',
    })
    await new AWS.SES()
        .sendEmail({
            Source: `Tableau App <jeremy93-2008@hotmail.fr>`,
            Destination: { ToAddresses: [email] },
            Message: {
                Subject: {
                    Charset: 'UTF-8',
                    Data: `Invitation to Collaborate on ${board.name} Board in Tableau App`,
                },
                Body: {
                    Text: {
                        Charset: 'UTF-8',
                        Data: `Dear ${email},

You have been invited by ${session.user!.name} to collaborate on ${
                            board.name
                        } in the Tableau App.

Tableau App is a powerful tool that helps teams visualize, analyze and share boards and tasks.

To access the board, please follow these steps:

    Click on the following link: https://tableau-beta.vercel.app/
    Log in to your Tableau account with the email that you was invite or create a new one
    Once you are logged in, you will be able to view and edit the board.

Best regards,
Tableau Team`,
                    },
                },
            },
        })
        .promise()
}
