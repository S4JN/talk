import { useState } from 'react'
import { Route, Routes } from 'react-router-dom';
import { ChatPage, HomePage } from './pages';
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </div>
  )
}

export default App
