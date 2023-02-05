import { useCallback, useEffect } from 'react'
import { useAtom } from 'jotai'
import { QueryKey } from '@tanstack/query-core'
import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { LoadingAtom } from 'shared-atoms'
import { signIn, useSession } from 'next-auth/react'
import { AxiosError } from 'axios'
import { useToast } from '@chakra-ui/react'

export function useTableauQuery<TData>(
    queryKey: QueryKey,
    options?: UseQueryOptions
) {
    const toast = useToast()

    const { data: session } = useSession()
    const [loading, setLoading] = useAtom(LoadingAtom)

    const onError = useCallback(
        (e: AxiosError) => {
            toast({
                title: e.response!.statusText,
                description: e.response!.data as string,
                status: 'error',
                duration: 9000,
            })
        },
        [toast]
    )

    const query = useQuery<TData>(queryKey, { ...options, onError } as any)

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
