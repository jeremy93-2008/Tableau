import { atom } from 'jotai'

interface ILoadingAtom {
    query: Record<string, boolean>
    mutation: boolean
}
export const LoadingAtom = atom<ILoadingAtom>({ query: {}, mutation: false })
