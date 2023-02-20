import { Box, Flex, Heading, IconButton, Text, Tooltip } from '@chakra-ui/react'
import { Finder, Icon } from 'shared-components'
import { Profile } from 'shared-components'
import { BiMenu } from 'react-icons/bi'
import { useCallback } from 'react'
import { useAtom } from 'jotai'
import { SidePanelAtom } from 'shared-atoms'

export function Header() {
    const [isSidePanelOpen, setSidePanelOpen] = useAtom(SidePanelAtom)

    const onSideMenuClick = useCallback(() => {
        setSidePanelOpen(!isSidePanelOpen)
    }, [isSidePanelOpen, setSidePanelOpen])

    return (
        <Flex
            alignItems="center"
            justifyContent="space-between"
            bg="teal.500"
            color="white"
            py="4"
            px="8"
            zIndex={15}
        >
            <Heading
                as="h1"
                display="flex"
                alignItems="center"
                fontSize="1.5rem"
            >
                <Box display={{ base: 'block', md: 'none' }}>
                    <Tooltip label="Open Boards List">
                        <IconButton
                            onClick={onSideMenuClick}
                            colorScheme="teal"
                            aria-label="Open sidepanel"
                            borderRadius="50%"
                            mr={2}
                            p={1}
                            icon={<BiMenu color="#B2F5EA" size="32px" />}
                        />
                    </Tooltip>
                </Box>
                <Icon />
                <Text
                    display={{ base: 'none', md: 'block' }}
                    ml={2}
                    fontFamily="sans-serif"
                >
                    Tableau
                </Text>
            </Heading>
            <Finder />
            <Profile />
        </Flex>
    )
}
