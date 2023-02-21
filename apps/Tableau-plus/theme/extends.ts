import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
    fonts: {
        heading: `'Silom','Open Sans', sans-serif`,
        body: `'Roboto', sans-serif`,
    },
    config: { initialColorMode: 'light', useSystemColorMode: true },
})

export default theme
