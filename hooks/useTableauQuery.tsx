import { useEffect } from 'react'
import { useAtom } from 'jotai'
import { QueryFunction, QueryKey } from '@tanstack/query-core'
import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { LoadingAtom } from '../atoms/loadingAtom'

export function useTableauQuery<TData>(
    queryKey: QueryKey,
    options?: UseQueryOptions
) {
    const [_isLoading, setLoading] = useAtom(LoadingAtom)

    const query = useQuery<TData>(
        queryKey,
        options as QueryFunction<TData, QueryKey>
    )

    const { isFetching, isLoading, isRefetching } = query

    useEffect(() => {
        if (isFetching || isLoading || isRefetching) return setLoading(true)
        setLoading(false)
    }, [isFetching, isLoading, isRefetching, setLoading])

    return query
}
