import { useEffect } from 'react'
import { useAtom } from 'jotai'
import { QueryFunction, QueryKey } from '@tanstack/query-core'
import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { LoadingAtom } from '../atoms/loadingAtom'
import { useSession } from 'next-auth/react'

export function useTableauQuery<TData>(
    queryKey: QueryKey,
    options?: UseQueryOptions
) {
    const { data: session } = useSession()
    const [_isLoading, setLoading] = useAtom(LoadingAtom)

    const query = useQuery<TData>(
        queryKey,
        options as QueryFunction<TData, QueryKey>
    )

    const { isFetching, isLoading, isRefetching } = query

    useEffect(() => {
        if (!session) return
        if (isFetching || isLoading || isRefetching) return setLoading(true)
        setLoading(false)
    }, [session, isFetching, isLoading, isRefetching, setLoading])

    return query
}
