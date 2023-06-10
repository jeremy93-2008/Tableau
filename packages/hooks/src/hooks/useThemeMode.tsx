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

    const borderTeal = useColorModeValue('#54d6d0', '#026060')

    const taskEditTabText = useColorModeValue('teal.600', 'white')
    const taskEditTabTextSelected = useColorModeValue('white', 'teal.700')

    const taskEditTabBg = useColorModeValue('transparent', 'transparent')
    const taskEditTabBgSelected = useColorModeValue('teal.500', 'teal.200')

    const colorSchemeAssignedUser = useColorModeValue('gray', 'blackAlpha')
    const bgAssignedUser = useColorModeValue('gray.100', 'gray.600')

    const hoverAssignedUser = useColorModeValue('gray.100', 'blackAlpha.300')
    const separatorAssignedUser = useColorModeValue(
        'gray.200',
        'blackAlpha.400'
    )
    const textAssignedUser = useColorModeValue('gray.600', 'gray.50')

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
        border: {
            teal: borderTeal,
        },
        taskEditTab: {
            text: taskEditTabText,
            textSelected: taskEditTabTextSelected,
            bg: taskEditTabBg,
            bgSelected: taskEditTabBgSelected,
        },
        assignedUser: {
            colorScheme: colorSchemeAssignedUser,
            bg: bgAssignedUser,
            hover: hoverAssignedUser,
            separator: separatorAssignedUser,
            text: textAssignedUser,
        },
    }
}
