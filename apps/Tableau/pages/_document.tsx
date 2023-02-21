import { ColorModeScript } from '@chakra-ui/react'
import { Head, Html, Main, NextScript } from 'next/document'
import theme from '../theme/extends'

export default function Document() {
    return (
        <Html lang="en">
            <title>Tableau - A Board Web App</title>
            <Head>
                <link rel="shortcut icon" href="/favicon.svg" />
            </Head>
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
