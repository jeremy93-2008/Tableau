import { atom } from 'jotai'
import { noop } from '@chakra-ui/utils'

export const RefetchBoardAtom = atom<{ fetch: () => void }>({ fetch: noop })
