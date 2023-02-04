import { useCallback, useEffect } from 'react'
import { useAtom } from 'jotai'
import { MutationFunction } from '@tanstack/query-core'
import {
    UseMutateAsyncFunction,
    UseMutateFunction,
    useMutation,
    UseMutationOptions,
    UseMutationResult,
} from '@tanstack/react-query'
import { LoadingAtom } from 'shared-atoms'
import { MutateOptions } from '@tanstack/query-core/src/types'

export function useTableauMutation<TData, TVariables>(
    mutationFn: MutationFunction<TData, TVariables>,
    options?: UseMutationOptions<TData, unknown, TVariables> & {
        key?: string
        noLoading?: boolean
    }
): UseMutationResult<TData, unknown, TVariables> {
    const [_loading, setLoading] = useAtom(LoadingAtom)

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
                setLoading({ isLoading: true, reason: mutateAsync.toString() })
                return mutateAsync(variables, options)
            }
        },
        [setLoading]
    )

    return {
        ...mutation,
        mutateAsync: handleMutateAsyncFn(mutation.mutateAsync),
    }
}
