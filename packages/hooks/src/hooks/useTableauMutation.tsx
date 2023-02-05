import { useCallback, useEffect } from 'react'
import { useAtom } from 'jotai'
import { MutationFunction } from '@tanstack/query-core'
import {
    UseMutateAsyncFunction,
    useMutation,
    UseMutationOptions,
    UseMutationResult,
} from '@tanstack/react-query'
import { LoadingAtom } from 'shared-atoms'
import { MutateOptions } from '@tanstack/query-core/src/types'
import { AxiosError } from 'axios'
import { signIn } from 'next-auth/react'

export function useTableauMutation<TData, TVariables>(
    mutationFn: MutationFunction<TData, TVariables>,
    options?: UseMutationOptions<TData, unknown, TVariables> & {
        key?: string
        noLoading?: boolean
    }
): UseMutationResult<TData, unknown, TVariables> {
    const [_loading, setLoading] = useAtom(LoadingAtom)
    const defaultOptions = options

    const mutation = useMutation<TData, unknown, TVariables>(
        mutationFn,
        options
    )

    const handleMutateAsyncFn = useCallback(
        (
            mutateAsync: UseMutateAsyncFunction<
                TData,
                unknown,
                TVariables,
                unknown
            >
        ) => {
            return (
                variables: TVariables,
                options?: MutateOptions<TData, unknown, TVariables, unknown>
            ) => {
                if (!defaultOptions?.noLoading) {
                    setLoading({
                        isLoading: true,
                        reason: defaultOptions?.key ?? mutateAsync.toString(),
                    })
                }
                const awaitedMutateAsync = mutateAsync(variables, options)

                awaitedMutateAsync.catch((e: AxiosError) => {
                    setLoading({
                        isLoading: false,
                        reason: e.response!.statusText,
                    })
                    if (e.response!.status === 401)
                        signIn(
                            'auth0',
                            { callbackUrl: '/' },
                            { prompt: 'login' }
                        ).then()
                })

                return awaitedMutateAsync
            }
        },
        [defaultOptions, setLoading]
    )

    return {
        ...mutation,
        mutateAsync: handleMutateAsyncFn(mutation.mutateAsync),
    }
}
