import React from 'react'
import { Provider } from 'jotai'
import {SiFoodpanda} from "react-icons/si"
import { Flex, Link, Box, Spinner } from "@chakra-ui/react";
import { LoadingProvider } from 'shared-components'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'

export default function Home() {
    return (
        <Flex>
            <Provider>
                <DndProvider backend={HTML5Backend}>
                    <Flex width="100vw" height="100vh" flexDirection="column" justifyContent="center" alignItems="center" mx={4} my={4}>
                      <Flex bgColor="teal.200" p={10} borderRadius={10} flexDirection="column" alignItems="center">
                        <SiFoodpanda size={"250px"} />
                        <Box mt={3} textAlign="center">
                          No ready, still in development, go to the Tableau
                          application:
                        </Box>
                        <Box>
                          <Link color="teal.800" colorScheme="teal" href="https://tableau-jeremy93-2008.vercel.app/">
                            https://tableau-jeremy93-2008.vercel.app/
                          </Link>
                        </Box>
                      </Flex>
                      </Flex>

                </DndProvider>
            </Provider>
        </Flex>
    )
}
