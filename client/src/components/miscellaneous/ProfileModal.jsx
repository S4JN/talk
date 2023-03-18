import { ViewIcon } from '@chakra-ui/icons';
import { IconButton, Image, Text, useDisclosure } from '@chakra-ui/react'
import React from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button
} from '@chakra-ui/react'

const ProfileModal = ({ user, children }) => {

    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <div>
            {
                children ? (
                    <span onClick={onOpen}>{children}</span>
                ) : (
                    <IconButton
                        d={{ base: "flex" }}
                        icon={<ViewIcon />}
                        onClick={onOpen}
                    />
                )
            }
            <Modal size="lg"isCentered isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent h="410px" >
                    <ModalHeader
                        fontSize="40px"
                        fontFamily={"Work sans"}
                        display="flex"
                        justifyContent={"center"}
                    >
                        {user.data.name}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display={"flex"}
                        flexDir="column"
                        alignItems={"center"}
                        justifyContent="space-between"
                    >
                        <Image
                            borderRadius={"full"}
                            boxSize="150px"
                            src={user.data.pic}
                            alt={user.data.name}
                        />

                        <Text
                            fontSize={{ base: "28px", md: "30px" }}
                            fontFamily="Work sans"
                        >
                            Email: {user.data.email}
                        </Text>

                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button>

                    </ModalFooter>
                </ModalContent>
            </Modal>

        </div>
    )
}

export default ProfileModal