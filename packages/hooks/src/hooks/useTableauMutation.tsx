import { useCallback } from 'react'
import { useAtom } from 'jotai'
import { MutationFunction } from '@tanstack/query-core'
import {
    UseMutateAsyncFunction,
    useMutation,
    UseMutationOptions,
    UseMutationResult,
} from '@tanstack/react-query'
import { useToast } from '@chakra-ui/react'
import { LoadingAtom } from 'shared-atoms'
import { MutateOptions } from '@tanstack/query-core/src/types'
import { AxiosError } from 'axios'
import { reloadSession } from 'shared-utils'

export function useTableauMutation<TData, TVariables>(
    mutationFn: MutationFunction<TData, TVariables>,
    options?: UseMutationOptions<TData, unknown, TVariables> & {
        key?: string
        noLoading?: boolean
    }
): UseMutationResult<TData, unknown, TVariables> {
    const toast = useToast()
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
                const awaitedMutateAsync = mutateAsync(variables, options)

                awaitedMutateAsync.catch((e: AxiosError) => {
                    toast({
                        title: e.response!.statusText,
                        description: e.response!.data as string,
                        status: 'error',
                        duration: 9000,
                    })
                    reloadSession()
                })

                return awaitedMutateAsync
            }
        },
        [defaultOptions, toast]
    )

    return {
        ...mutation,
        mutateAsync: handleMutateAsyncFn(mutation.mutateAsync),
    }
}
