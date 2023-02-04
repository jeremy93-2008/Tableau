import { atom } from 'jotai'

interface ILoadingAtom {
    isLoading: boolean
    reason: string | null
}

export const LoadingAtom = atom<ILoadingAtom>({
    isLoading: false,
    reason: null,
})
