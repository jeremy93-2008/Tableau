import { atom } from 'jotai'
import { IBoardWithAllRelation } from 'shared-types'

export const BoardAtom = atom<IBoardWithAllRelation | null>(null)
