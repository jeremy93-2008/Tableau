import { NextApiRequest } from 'next'
import { z } from 'zod'
import { Prisma } from '@prisma/client'

export type IErrorPromiseReject<TParams> = {
    inputError: z.ZodError<TParams>
    checkError: { status: number; message: string }
    serverError?: Partial<Prisma.PrismaClientKnownRequestError>
}

export function Procedure<TParams>(options: { req: NextApiRequest }) {
    let params = null as TParams | null
    let isCheck = true
    let checkError = {} as { status: number; message: string }
    let inputError = {} as z.ZodError<TParams>
    let isInputCorrect = false
    const setError = (status: number, message: string) => {
        checkError = { status, message }
        return false as false
    }
    const objChaining = {
        input: (
            inputFn: (
                req: NextApiRequest
            ) => z.SafeParseReturnType<TParams, TParams>
        ) => {
            const safeParse = inputFn(options.req)
            if (!safeParse.success) {
                isInputCorrect = false
                inputError = safeParse.error
                return objChaining
            }
            params = safeParse.data
            isInputCorrect = true

            return objChaining
        },
        check: (
            checkFn: (
                params: TParams | null,
                setError: (status: number, message: string) => false
            ) => boolean
        ) => {
            if (!checkFn(params, setError)) {
                isCheck = false
                return objChaining
            }
            return objChaining
        },
        checkAsync: async (
            checkFn: (
                params: TParams | null,
                setError: (status: number, message: string) => false
            ) => Promise<boolean>
        ) => {
            if (!(await checkFn(params, setError))) {
                isCheck = false
                return objChaining
            }
            return objChaining
        },
        success: async (onSuccess: (params: TParams) => Promise<void>) => {
            try {
                if (!isCheck || !isInputCorrect) {
                    throw new Error("Can't execute success", {
                        cause: {
                            isCheck,
                            isInputCorrect,
                        },
                    })
                }
                return await onSuccess(params!)
            } catch (e) {
                const err = e as Prisma.PrismaClientKnownRequestError
                return new Promise((resolve, reject) =>
                    reject({
                        inputError,
                        checkError,
                        serverError: {
                            stack: err.stack,
                            message: err.message,
                            code: err.code,
                            cause: err.cause,
                        },
                    } as IErrorPromiseReject<TParams>)
                )
            }
        },
    }

    return objChaining
}
