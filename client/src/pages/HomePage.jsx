import React from 'react'
import { Box, Container, Text, Tabs, Tab, TabList, TabPanel, TabPanels } from "@chakra-ui/react"
import { Login, SignUp } from '../components'




const HomePage = () => {
    return (
        <Container maxW="xl" align='center' >
            <Box
                d="flex"
                justifyContent="center"
                p={1}
                bg={"white"}
                w="100%"
                m="40px 0 15px 0"
                borderRadius="lg"
                borderWidth="1px"
            >
                <Text fontSize="4xl" fontFamily="Work sans" color="black" >
                    Talk
                </Text>
            </Box>
            <Box bg="white" w="100%" p={4} color="black" borderRadius="lg" borderWidth="1px" >
                <Tabs variant='soft-rounded' >
                    <TabList mb="1em">
                        <Tab width="50%" >Login</Tab>
                        <Tab width="50%" >Sign Up</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <Login />
                        </TabPanel>
                        <TabPanel>
                            <SignUp />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>

        </Container>
    )
}

export default HomePage