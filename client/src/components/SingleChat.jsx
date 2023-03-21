import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, IconButton, Text } from '@chakra-ui/react';
import React from 'react'
import { ChatState } from '../context/ChatProvider'
import { getSender, getSenderFull } from '../config/ChatLogic';
import TempProfileModal from "./miscellaneous/TeampProfileModal"
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal"
const SingleChat = ({ fetchAgain, setFetchAgain }) => {

    const { user, selectedChat, setSelectedChat } = ChatState();


    return (
        <>
            {selectedChat ? (
                <>
                    <Text
                        fontSize={{ base: "28px", md: "30px" }}
                        pb={3}
                        px={2}
                        w="100%"
                        fontFamily="Work sans"
                        display="flex"
                        justifyContent={{ base: "space-between" }}
                        alignItems="center"
                    >
                        <IconButton
                            display={{ base: "flex", md: "none" }}
                            icon={<ArrowBackIcon />}
                            onClick={() => setSelectedChat("")}
                        />
                        {!selectedChat.isGroupChat ? (
                            <>
                                {getSender(user, selectedChat.users)}
                                <TempProfileModal user={getSenderFull(user, selectedChat.users)} />
                            </>
                        ) : (
                            <>
                                {selectedChat.chatName.toUpperCase()}
                                {<UpdateGroupChatModal
                                    fetchAgain={fetchAgain}
                                    setFetchAgain={setFetchAgain}
                                />}
                            </>
                        )}

                    </Text>
                    <Box
                        display={"flex"}
                        flexDir="column"
                        justifyContent={"flex-end"}
                        p={3}
                        bg="#E8E8E8"
                        w="100%"
                        h="100%"
                        borderRadius={"lg"}
                        overflowY="hidden"

                    >
                        {/* messages here  */}
                    </Box>


                </>
            ) : (
                <Box display="flex" alignItems="center" justifyContent="center" height="100%" textAlign="center">
                    <Text fontSize="3xl" pb={3} fontFamily="Work sans">
                        Click on User to Start Chatting
                    </Text>
                </Box>

            )}
        </>
    )
}

export default SingleChat