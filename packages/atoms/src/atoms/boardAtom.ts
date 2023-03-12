import { atom } from 'jotai'
import { IBoardWithAllRelation } from 'shared-components'

export const BoardAtom = atom<IBoardWithAllRelation | null>(null)
