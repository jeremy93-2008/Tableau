import { atom } from 'jotai'
import { Task } from '.prisma/client'

export const HighlightTaskAtom = atom<Task | null>(null)
