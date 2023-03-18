import { NextApiRequest } from 'next'
import { z } from 'zod'

export type IErrorPromiseReject<TParams> = {
    inputError: z.ZodError<TParams>
    checkError: { status: number; message: string }
    stackTrace?: string
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
                return await onSuccess(params!)
            } catch (e) {
                return new Promise((resolve, reject) =>
                    reject({
                        inputError,
                        checkError,
                        stackTrace: e,
                    } as IErrorPromiseReject<TParams>)
                )
            }
        },
    }

    return objChaining
}
