import { atom } from 'jotai/esm'
import { Task } from '.prisma/client'

export const FoundTaskAtom = atom<Task | null>(null)
