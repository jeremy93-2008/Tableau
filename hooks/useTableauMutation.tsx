import { useEffect } from 'react'
import { useAtom } from 'jotai'
import { MutationFunction } from '@tanstack/query-core'
import { useMutation, UseMutationOptions } from '@tanstack/react-query'
import { LoadingAtom } from '../atoms/loadingAtom'

export function useTableauMutation<TData, TVariables>(
    mutationFn: MutationFunction<TData, TVariables>,
    options?: UseMutationOptions<TData, unknown, TVariables>
) {
    const [_isLoading, setLoading] = useAtom(LoadingAtom)

    const mutation = useMutation<TData, unknown, TVariables>(
        mutationFn,
        options
    )

    const { isLoading } = mutation

    useEffect(() => {
        if (isLoading) return setLoading(true)
        setLoading(false)
    }, [isLoading, setLoading])

    return mutation
}
