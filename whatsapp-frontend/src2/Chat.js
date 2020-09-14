import React, { useState } from 'react';
import { Avatar, IconButton } from '@material-ui/core';
import { SearchOutlined, AttachFile, MoreVert, InsertEmoticon } from '@material-ui/icons';
import MicIcon from '@material-ui/icons/Mic';
import './Chat.css';
import axios from './axios';

function Chat({ messages }) {
  const [input, setInput] = useState('');

  const sendMessage = async (event) => {
    event.preventDefault();

    axios.post('/messages/new', {
      name: "Hugo",
      message: input,
      timestamp: "now",
      received: true
    })

    setInput('');
  }

  return (
    <div className='chat'>
      <div className='chat__header'>
        <Avatar />

        <div className='chat__headerInfo'>
          <h3>Room name</h3>
          <p>Last seen at ...</p>
        </div>

        <div className='chat__headerRight'>
          <IconButton>
            <SearchOutlined />
          </IconButton>
          <IconButton>
            <AttachFile />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </div>
      </div>

      <div className='chat__body'>
        {/* should have key */}
        {messages.map((message) => (
          <p className={`chat__message ${message.received && "chat__reciever"}`}>
            <span className='chat__name'>
              {message.name}
            </span>
            {message.message}
            <span className='chat__timestamp'>
              {message.timestamp}
            </span>
          </p>
        ))}
      </div>

      <div className='chat__footer'>
        <InsertEmoticon />
        <form>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message"
            type='text'
          />
          <button onClick={sendMessage} type='submit'>
            Send
          </button>
          <MicIcon />
        </form>
      </div>
    </div>
  )
}

export default Chat
