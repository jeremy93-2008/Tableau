import { atom } from 'jotai'
import { QueryObserverResult } from '@tanstack/react-query'
import { IBoardWithAllRelation } from 'shared-types'

export const RefetchBoardAtom = atom<{
    fetch: () => Promise<
        QueryObserverResult<IBoardWithAllRelation[], unknown> | unknown
    >
}>({ fetch: () => new Promise((res) => res(undefined)) })
