import { Box, FormControl, IconButton, Input, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Spinner
} from '@chakra-ui/react'
import { ViewIcon } from '@chakra-ui/icons';
import { ChatState } from '../../context/ChatProvider';
import UserBadgeItem from '../userAvatar/UserBadgeItem';
import axios from 'axios';
import UserListItem from '../userAvatar/UserListItem';



const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain }) => {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const { selectedChat, setSelectedChat, user } = ChatState();
    const [renameloading, setRenameloading] = useState(false);
    const [loading, setLoading] = useState(false);

    const toast = useToast();

    const handleRemove = () => {

    }
    const handleAddUser= async() =>{

    }

    const handleRename = async () => {
        if (!groupChatName) return

        try {
            setRenameloading(true);

            const config = {
                headers: {
                    Authorization: `Bearer ${user.data.token}`,
                },
            }
            const { data } = await axios.put("http://localhost:8080/api/chat/rename", {
                chatId: selectedChat._id,
                chatName: groupChatName,
            }, config);

            setSelectedChat(data);
            console.log(data, "rename data");
            setFetchAgain(!fetchAgain);
            setRenameloading(false);
        } catch (error) {
            console.log(error);
            toast({
                title: "Error Occured while renaming",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            setRenameloading(false);
            setGroupChatName("")
        }
    }

    const handleSearch = async (query) => {
        setSearch(query)
        if (!query) {
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.data.token}`,
                },
            };

            const { data } = await axios.get(`http://localhost:8080/api/user?search=${search}`, config);
            console.log(data);
            setSearchResult(data);
            setLoading(false);
        } catch (error) {
            console.log(error);
            toast({
                title: "Errror Occured!",
                description: "Failed to Load the Search Results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    }

    return (
        <div>
            <IconButton
                display={{ base: "flex" }}
                onClick={onOpen}
                icon={<ViewIcon />}

            />

            <Modal isOpen={isOpen} onClose={onClose} isCentered >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize={"35px"}
                        fontFamily="Work sans"
                        display={"flex"}
                        justifyContent="center"
                    >
                        {selectedChat.chatName}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box width={"100%"} display="flex" flexWrap={"wrap"} pb={3} >
                            {selectedChat.users.map(u => (
                                <UserBadgeItem
                                    key={u._id}
                                    user={u}
                                    handleFunction={() => handleRemove(u)}
                                />
                            ))}
                        </Box>
                        <FormControl display="flex" >
                            <Input
                                placeholder="Chat name"
                                mb={3}
                                value={groupChatName}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                            <Button
                                variant="solid"
                                colorScheme="teal"
                                ml={1}
                                isLoading={renameloading}
                                onClick={handleRename}
                            >
                                Update
                            </Button>
                        </FormControl>
                        <FormControl>
                            <Input
                                placeholder='Add User to group'
                                mb={1}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>

                        {loading ? <Spinner mt={3} /> : (
                            searchResult?.slice(0, 4).map(user => (
                                <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => handleAddUser(user)}
                                />
                            ))
                        )}

                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='red' onClick={() => handleRemove(user)}>
                            Leave Group
                        </Button>

                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
}

export default UpdateGroupChatModal