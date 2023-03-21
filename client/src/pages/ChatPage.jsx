import React, { useState } from 'react';
import { ChatState } from "../context/ChatProvider";
import { SideDrawer, MyChats, ChatBox } from '../components';
import { Box } from "@chakra-ui/react"

const ChatPage = () => {
    const { user } = ChatState();
    const [fetchAgain, setFetchAgain] = useState(false);

    return (
        <div style={{ width: "100%" }}>
            {user && <SideDrawer />}
            <Box
                display="flex"
                justifyContent="space-between"
                width="100%"
                height="91.5vh"
                padding="10px"
            >
                {user && <MyChats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
                {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
            </Box>
        </div>
    );
};

export default ChatPage;
