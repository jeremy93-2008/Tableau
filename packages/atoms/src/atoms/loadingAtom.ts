import { atom } from 'jotai'

interface ILoadingAtom {
    query: Record<string, { loadingKey: string | null; isLoading: boolean }>
    mutation: { loadingKey: string | null; isLoading: boolean }
}
export const LoadingAtom = atom<ILoadingAtom>({
    query: {},
    mutation: { loadingKey: null, isLoading: false },
})
