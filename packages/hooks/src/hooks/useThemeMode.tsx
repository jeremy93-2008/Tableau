import { useColorModeValue } from '@chakra-ui/react'

export function useThemeMode() {
    const bgPrimary = useColorModeValue('teal.500', 'teal.900')
    const bgSecondary = useColorModeValue('gray.100', 'teal.800')
    const bgTertiary = useColorModeValue('gray.50', 'teal.700')
    const bgColumns = useColorModeValue('teal.400', 'teal.900')
    const bgModal = useColorModeValue('gray.50', 'gray.700')
    const bgModalHover = useColorModeValue('teal.500', 'teal.500')

    const textPrimary = useColorModeValue('gray.600', 'gray.50')
    const textSearch = useColorModeValue('gray.700', 'gray.500')
    const textSearchDisabled = useColorModeValue('gray.200', 'gray.500')
    const textHover = useColorModeValue('gray.100', 'gray.100')
    const textBlackWhite = useColorModeValue('black', 'white')

    const contrastDisabled = useColorModeValue('contrast(90%)', 'contrast(70%)')

    const boxShadow = useColorModeValue(
        '0 5px 10px rgba(0,0,0,0.3)',
        '0 5px 10px rgba(0,0,0,0.6)'
    )

    return {
        bg: {
            primary: bgPrimary,
            secondary: bgSecondary,
            tertiary: bgTertiary,
            columns: bgColumns,
            modal: bgModal,
            modalHover: bgModalHover,
        },
        text: {
            primary: textPrimary,
            search: textSearch,
            searchDisabled: textSearchDisabled,
            hover: textHover,
            contrast: textBlackWhite,
        },
        contrast: {
            disabled: contrastDisabled,
        },
        boxShadow: {
            primary: boxShadow,
        },
    }
}
