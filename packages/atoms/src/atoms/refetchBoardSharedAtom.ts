import { atom } from 'jotai'
import { noop } from '@chakra-ui/utils'

export const RefetchBoardSharedAtom = atom<{ fetch: () => void }>({
    fetch: noop,
})
