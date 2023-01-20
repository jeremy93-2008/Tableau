import { atom } from 'jotai'
import { IBoardWithAllRelation } from '../types/types'

export const BoardAtom = atom<IBoardWithAllRelation | null>(null)
