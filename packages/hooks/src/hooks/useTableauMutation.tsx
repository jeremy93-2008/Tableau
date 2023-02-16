import { useCallback } from 'react'
import { useAtom, useSetAtom } from 'jotai'
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
        loadingKey?: string | null
        noLoading?: boolean
    }
): UseMutationResult<TData, unknown, TVariables> {
    const toast = useToast()
    const defaultOptions = options

    const setLoadingObj = useSetAtom(LoadingAtom)

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
                if (!defaultOptions?.noLoading) {
                    setLoadingObj((prevLoadingObj) => ({
                        ...prevLoadingObj,
                        mutation: {
                            loadingKey: defaultOptions?.loadingKey ?? null,
                            isLoading: true,
                        },
                    }))
                }
                awaitedMutateAsync.then(() => {
                    setLoadingObj((prevLoadingObj) => ({
                        ...prevLoadingObj,
                        mutation: {
                            loadingKey: defaultOptions?.loadingKey ?? null,
                            isLoading: false,
                        },
                    }))
                })

                awaitedMutateAsync.catch((e: AxiosError) => {
                    setLoadingObj((prevLoadingObj) => ({
                        ...prevLoadingObj,
                        mutation: {
                            loadingKey: defaultOptions?.loadingKey ?? null,
                            isLoading: false,
                        },
                    }))
                    toast({
                        title: e.response!.statusText,
                        description: e.response!.data as string,
                        status: 'error',
                        duration: 9000,
                        isClosable: true,
                    })
                    reloadSession()
                })

                return awaitedMutateAsync
            }
        },
        [setLoadingObj, toast]
    )

    return {
        ...mutation,
        mutateAsync: handleMutateAsyncFn(mutation.mutateAsync),
    }
}
