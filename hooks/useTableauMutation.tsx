import { useEffect } from 'react'
import { useAtom } from 'jotai'
import { MutationFunction } from '@tanstack/query-core'
import { useMutation, UseMutationOptions } from '@tanstack/react-query'
import { LoadingAtom } from '../atoms/loadingAtom'
import { bool } from 'yup'

export function useTableauMutation<TData, TVariables>(
    mutationFn: MutationFunction<TData, TVariables>,
    options?: UseMutationOptions<TData, unknown, TVariables> & {
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
        if (isLoading) return setLoading(true)
        setLoading(false)
    }, [options, isLoading, setLoading])

    return mutation
}
