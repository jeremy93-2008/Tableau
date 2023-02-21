import { ColorModeScript } from '@chakra-ui/react'
import { Head, Html, Main, NextScript } from 'next/document'
import theme from 'tableau/theme/extends'

export default function Document() {
    return (
        <Html lang="en">
            <title>Tableau Plus - A Project Management Web App</title>
            <Head />
            <body>
                <ColorModeScript
                    initialColorMode={theme.config.initialColorMode}
                />
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}
