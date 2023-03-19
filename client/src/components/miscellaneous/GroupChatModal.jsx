import { Box, FormControl, Input, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
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
import axios from 'axios';
import React, { useState } from 'react'
import { ChatState } from '../../context/ChatProvider';
import UserListItem from '../userAvatar/UserListItem';
import UserBadgeItem from "../userAvatar/UserBadgeItem";

const GroupChatModal = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);

    const toast = useToast();

    const { user, chats, setChats } = ChatState();


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

    const handleSubmit = async () => {
        if (!groupChatName || !selectedUsers) {
            toast({
                title: "Please fill all the fields",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top"
            });
            return
        }

        try {

            const config = {
                headers: {
                    Authorization: `Bearer ${user.data.token}`,
                },
            };

            const { data } = await axios.post("http://localhost:8080/api/chat/group", {
                name: groupChatName,
                users: JSON.stringify(selectedUsers.map(u => u._id)),
            },config);
            console.log(data,"Group vala");
            setChats([data,...chats]);
            onClose();
            toast({
                title: "New Group Chat created",
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });

        } catch (error) {
            console.log(error);
            toast({
                title: "error while creating grp",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top"
            });
        }

    }

    const handleGroup = (userToAdd) => {
        if (selectedUsers.includes(userToAdd)) {
            toast({
                title: "User already added",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top"
            });
            return;
        }

        setSelectedUsers([...selectedUsers, userToAdd]);
    }

    const handleDelete = (delUser) => {
        setSelectedUsers(selectedUsers.filter(sel => sel._id !== delUser._id))
    }

    return (
        <div>
            <span onClick={onOpen}>{children}</span>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize={"35px"}
                        fontFamily="Work sans"
                        display={"flex"}
                        justifyContent="center"
                    >
                        Create Group
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody display={"flex"} flexDir="column" alignItems={"center"} >
                        <FormControl>
                            <Input
                                placeholder='Chat Name'
                                mb={3}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                        </FormControl>

                        <FormControl>
                            <Input
                                placeholder='Add Users eg. Srajan, Shelby'
                                mb={1}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>
                        <Box w="100%" display="flex" flexWrap="wrap">
                            {selectedUsers.map(u => (
                                <UserBadgeItem
                                    key={u._id}
                                    user={u}
                                    handleFunction={() => handleDelete(u)}

                                />
                            ))}
                        </Box>
                        {loading ? <Spinner mt={3} /> : (
                            searchResult?.slice(0, 4).map(user => (
                                <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => handleGroup(user)}
                                />
                            ))
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' onClick={handleSubmit}>
                            Create Group
                        </Button>

                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
}

export default GroupChatModal