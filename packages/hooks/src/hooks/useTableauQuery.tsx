import { useCallback, useEffect } from 'react'
import { useSetAtom } from 'jotai'
import { QueryKey } from '@tanstack/query-core'
import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { LoadingAtom } from 'shared-atoms'
import { useSession } from 'next-auth/react'
import { reloadSession } from 'shared-utils'
import { AxiosError } from 'axios'
import { useToast } from '@chakra-ui/react'

export function useTableauQuery<TData>(
    queryKey: QueryKey,
    options?: UseQueryOptions & {
        loadingKey?: string | null
        noLoading?: boolean
    }
) {
    const toast = useToast()

    const setLoadingObj = useSetAtom(LoadingAtom)

    const onError = useCallback(
        (e: AxiosError) => {
            reloadSession()
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
        if (options?.noLoading) return
        setLoadingObj((prevLoad) => {
            if (
                prevLoad.query[queryKey as unknown as string] &&
                isLoading ===
                    prevLoad.query[queryKey as unknown as string].isLoading
            ) {
                return prevLoad
            } else {
                return {
                    ...prevLoad,
                    query: {
                        ...prevLoad.query,
                        [queryKey as unknown as string]: {
                            loadingKey: options?.loadingKey ?? null,
                            isLoading: isLoading || isRefetching || isFetching,
                        },
                    },
                }
            }
        })
    }, [
        isLoading,
        isRefetching,
        isFetching,
        setLoadingObj,
        queryKey,
        options?.noLoading,
        options?.loadingKey,
    ])

    return query
}
