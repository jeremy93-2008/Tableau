import '@fontsource/open-sauce-sans/300.css'
import '@fontsource/open-sauce-sans/400.css'
import '@fontsource/open-sauce-sans/500.css'
import '@fontsource/open-sauce-sans/600.css'
import '@fontsource/open-sauce-sans/700.css'
import '@fontsource/open-sauce-sans/800.css'
import '@fontsource/open-sauce-sans/900.css'

import '@fontsource/raleway/100.css'
import '@fontsource/raleway/200.css'
import '@fontsource/raleway/300.css'
import '@fontsource/raleway/400.css'
import '@fontsource/raleway/500.css'
import '@fontsource/raleway/600.css'
import '@fontsource/raleway/700.css'
import '@fontsource/raleway/800.css'
import '@fontsource/raleway/900.css'

import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
    fonts: {
        heading: `'Raleway','Open Sauce Sans', sans-serif`,
        body: `'Open Sauce Sans', sans-serif`,
    },
    config: { initialColorMode: 'light', useSystemColorMode: true },
})

export default theme
