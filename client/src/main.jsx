import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { BrowserRouter } from "react-router-dom";
import { ChakraProvider } from '@chakra-ui/react'
import ChatProvider from './context/ChatProvider';


ReactDOM.createRoot(document.getElementById('root')).render(

  <BrowserRouter>
    <ChatProvider>
      <ChakraProvider>
        <App />

      </ChakraProvider>
    </ChatProvider>
  </BrowserRouter>
)
