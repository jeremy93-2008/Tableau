import { useColorModeValue } from '@chakra-ui/react'

export function useThemeMode() {
    const bgPrimary = useColorModeValue('teal.500', 'teal.900')
    const bgSecondary = useColorModeValue('gray.100', 'teal.800')
    const bgTertiary = useColorModeValue('gray.50', 'teal.700')
    const bgModal = useColorModeValue('gray.50', 'gray.700')

    const textPrimary = useColorModeValue('gray.600', 'gray.50')
    const textSearch = useColorModeValue('gray.700', 'gray.500')

    return {
        bg: {
            primary: bgPrimary,
            secondary: bgSecondary,
            tertiary: bgTertiary,
            modal: bgModal,
        },
        text: {
            primary: textPrimary,
            search: textSearch,
        },
    }
}
