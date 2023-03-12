import React, { useEffect, useState } from 'react'
import axios from "axios"


const ChatPage = () => {
    const [chats, setChats] = useState([]);

    const fetchChats = async () => {
        console.log("fetch called");
        const { data } = await axios.get("http://127.0.0.1:8080/api/chat");
        console.log(data);
        setChats(data);
    }

    useEffect(() => {
        fetchChats();
    }, []);

    return (
        <div>{chats.map((chat) => <div key={chat._id}>{chat.chatName}</div>)}</div>
    )
}

export default ChatPage