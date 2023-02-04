import { useEffect } from 'react'
import { useAtom } from 'jotai'
import { QueryFunction, QueryKey } from '@tanstack/query-core'
import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { LoadingAtom } from 'shared-atoms'
import { useSession } from 'next-auth/react'

export function useTableauQuery<TData>(
    queryKey: QueryKey,
    options?: UseQueryOptions
) {
    const { data: session } = useSession()
    const [loading, setLoading] = useAtom(LoadingAtom)

    const query = useQuery<TData>(
        queryKey,
        options as QueryFunction<TData, QueryKey>
    )

    const { isFetching, isLoading, isRefetching } = query

    useEffect(() => {
        if (!session) return
        if (isFetching || isLoading || isRefetching) {
            if (loading.isLoading && loading.reason == (queryKey[0] as string))
                return
            return setLoading({
                isLoading: true,
                reason: queryKey[0] as string,
            })
        }
        if (!loading.isLoading || loading.reason !== (queryKey[0] as string))
            return
        setLoading({ isLoading: false, reason: queryKey[0] as string })
    }, [
        session,
        queryKey,
        loading,
        setLoading,
        isFetching,
        isLoading,
        isRefetching,
    ])

    return query
}
