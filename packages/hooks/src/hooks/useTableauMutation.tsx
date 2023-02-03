import { useEffect } from 'react'
import { useAtom } from 'jotai'
import { MutationFunction } from '@tanstack/query-core'
import { useMutation, UseMutationOptions } from '@tanstack/react-query'
import { LoadingAtom } from 'shared-atoms'

export function useTableauMutation<TData, TVariables>(
    mutationFn: MutationFunction<TData, TVariables>,
    options?: UseMutationOptions<TData, unknown, TVariables> & {
        key?: string
        noLoading?: boolean
    }
) {
    const [_isLoading, setLoading] = useAtom(LoadingAtom)

    const mutation = useMutation<TData, unknown, TVariables>(
        mutationFn,
        options
    )

    const { isLoading } = mutation

    useEffect(() => {
        if (options?.noLoading) return
        if (isLoading)
            return setLoading({
                isLoading: true,
                reason: options?.key ?? 'mutation',
            })
        setLoading({ isLoading: false, reason: options?.key ?? 'mutation' })
    }, [options, isLoading, setLoading])

    return mutation
}
