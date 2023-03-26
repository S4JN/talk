import React, { useEffect, useState } from 'react'
import { Avatar, Box, Button, Drawer, DrawerContent, Input, DrawerBody, DrawerHeader, DrawerOverlay, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Text, Tooltip, useDisclosure, useToast, Spinner } from '@chakra-ui/react';
import { theme } from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons"
import { ChatState } from '../../context/ChatProvider';
import ProfileModal from "./ProfileModal"
import ChatLoading from '../ChatLoading';
import { Navigate, useNavigate } from 'react-router-dom';
import UserListItem from "../userAvatar/UserListItem"
import axios from 'axios';
import { getSender } from '../../config/ChatLogic';
import NotificationBadge from "react-notification-badge"
import { Effect } from 'react-notification-badge';

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  const { user, setSelectedChat, chats, setChats, notification, setNotification } = ChatState();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  // useEffect(() => {
  //   console.log(user.data);
  // }, [])

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  }

  const toast = useToast();
  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
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
      setLoading(false);
      setSearchResult(data);

    } catch (error) {
      console.log(error);
      toast({
        title: "Error occured",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      })
    }


  }

  const accessChat = async (userId) => {
    console.log(userId);

    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.data.token}`,
        },
      };
      const { data } = await axios.post(`http://localhost:8080/api/chat`, { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      console.log(data);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      console.log(error);
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  }

  useEffect(() => {
    console.log(searchResult, "search results");
  }, [searchResult])


  return (
    <div>
      <Box
        style={{ display: "flex" }}
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search Users to chat" hasArrow placement='bottom-end'>
          <Button variant="ghost" onClick={onOpen}>
            <i className="fas fa-search"></i>
            <Text display={{ base: "none", md: "flex !important" }} px="4" >
              Search User
            </Text>
          </Button>

        </Tooltip>
        <Text fontSize="2xl" fontFamily="Work sans">
          Talk
        </Text>
        <div>
          <Menu>
            <MenuButton p={1} >
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
              <BellIcon fontSize={"2xl"} m={1} />
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length && "No New Messages"}
              {notification.map(notif => (
                <MenuItem key={notif._id} onClick={() => {
                  setSelectedChat(notif.chat)
                  setNotification(notification.filter((n) => n !== notif));
                }}>
                  {notif.chat.isGroupChat ? `New Message in${notif.chat.chatName}` : `New Message from ${getSender(user.data, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />} >
              <Avatar size="sm" cursor="pointer" name={user.data.name} src={user.data.pic} />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler} >Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth={"1px"}>Search Users</DrawerHeader>

          <DrawerBody>
            <Box display={"flex"} pb={2}>
              <Input
                placeholder='Search by email or name'
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button
                onClick={handleSearch}
              >Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult.map(user => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>

        </DrawerContent>
      </Drawer>





    </div>
  )
}

export default SideDrawer