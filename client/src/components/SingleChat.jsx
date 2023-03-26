import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, FormControl, IconButton, Input, Spinner, Text, Toast, useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import { ChatState } from '../context/ChatProvider'
import { getSender, getSenderFull } from '../config/ChatLogic';
import TempProfileModal from "./miscellaneous/TeampProfileModal"
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal"
import axios from 'axios';
import ScrollableChat from './ScrollableChat';
import io from "socket.io-client"
import Lottie from "react-lottie"
import animationData from "../animations/typing.json"

const ENDPOINT = "http://localhost:8080";
var socket, selectedChatCompare;



const SingleChat = ({ fetchAgain, setFetchAgain }) => {

    const { user, selectedChat, setSelectedChat, notification, setNotification } = ChatState();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState();
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };



    const toast = useToast();

    const fetchMessages = async () => {
        if (!selectedChat) return;

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.data.token}`,
                },
            };

            setLoading(true);
            const { data } = await axios.get(`http://localhost:8080/api/message/${selectedChat._id}`, config);
            setMessages(data);
            //console.log(data,"data");
            //api working fine data m sahi saman aara h dkt niche vale ki h
            // console.log(messages);
            setLoading(false);
            socket.emit("join_chat", selectedChat._id);
        } catch (error) {
            console.log(error);
            toast({
                title: "Error occured!",
                description: "failed to load messages",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        }
    }

    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", user.data);
        socket.on("connected", () => setSocketConnected(true));
        socket.on("typing", () => setIsTyping(true))
        socket.on("stop_typing", () => setIsTyping(false));
    }, [])


    useEffect(() => {
        fetchMessages();
        selectedChatCompare = selectedChat;
    }, [selectedChat])



    useEffect(() => {
        socket.on("message_recived", (newMessageRecieved) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id) {
                //give notification
                if(!notification.includes(newMessageRecieved)){
                    setNotification([newMessageRecieved,...notification]);
                    setFetchAgain(!fetchAgain);
                }
            } else {
                setMessages([...messages, newMessageRecieved]);
            }
        })
    })


    const sendMessage = async (event) => {

        if (event.key === "Enter" && newMessage) {
            socket.emit("stop_typing", selectedChat._id);
            try {
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.data.token}`
                    },
                };
                setNewMessage("");
                const { data } = await axios.post("http://localhost:8080/api/message", {
                    content: newMessage,
                    chatId: selectedChat._id,
                },
                    config);
                console.log(data, "message");
                socket.emit("new_message", data)
                setMessages([...messages, data])
            } catch (error) {
                toast({
                    title: "Error Occured while sending message",
                    description: "Failed to send message",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
            }
        }

    }





    const typingHandler = (e) => {
        setNewMessage(e.target.value);
        // typinglogic
        if (!socketConnected) return;

        if (!typing) {
            setTyping(true);
            socket.emit("typing", selectedChat._id)
        }

        let lastTypingTime = new Date().getTime()
        var timerLength = 3000;
        setTimeout(() => {
            var timeNow = new Date().getTime()
            var timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= timerLength && typing) {
                socket.emit("stop_typing", selectedChat._id);
                setTyping(false);
            }
        }, timerLength);

    }

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
                                    fetchMessages={fetchMessages}
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
                        {loading ? (

                            <Spinner
                                size="xl"
                                w={20}
                                h={20}
                                alignSelf="center"
                                margin={"auto"}
                            />
                        ) : (
                            <div className='messages'>
                                <ScrollableChat messages={messages} />
                            </div>
                        )}

                        <FormControl onKeyDown={sendMessage} isRequired mt={3} >
                            {isTyping ? <div> <Lottie options={defaultOptions} width={70} style={{ marginBottom: 15, marginLeft: 0 }} /> </div> : <></>}
                            <Input
                                variant={"filled"}
                                bg="#E0E0E0"
                                placeholder='Enter a message..'
                                onChange={typingHandler}
                                value={newMessage}
                            />
                        </FormControl>

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