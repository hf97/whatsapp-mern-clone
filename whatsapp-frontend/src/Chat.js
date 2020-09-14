import React, { useState, useEffect, useRef } from 'react';
import Pusher from 'pusher-js';
import { useParams } from 'react-router-dom';
import { Avatar, IconButton } from '@material-ui/core';
import { SearchOutlined, AttachFile, MoreVert, InsertEmoticon } from '@material-ui/icons';
import MicIcon from '@material-ui/icons/Mic';
import './Chat.css';
import axios from './axios';
import Message from './Message';
import { useStateValue } from './StateProvider';


import { animateScroll } from "react-scroll";


function Chat() {
  const [input, setInput] = useState('');
  const { roomId } = useParams();
  const [room, setRoom] = useState('');
  const [messages, setMessages] = useState([]);
  const [{ user }, dispatch] = useStateValue();

  async function fetchRoom() {
    const r = await axios.get(`/get/rooms/${roomId}`)
      .then(res => {
        setRoom(res.data);
      });
    return r;
  };

  async function fetchMessages() {
    const m = await axios.get(`/get/messages/room/${roomId}`)
      .then(res => {
        setMessages(res.data);
      })
    return m;
  };

  useEffect(() => {
    if (roomId) {
      fetchRoom();
      fetchMessages();
    }
  }, [roomId]);

  useEffect(() => {
    const pusher = new Pusher('96ee846e6ca898a809de', {
      cluster: 'eu'
    });

    const channel2 = pusher.subscribe('pMessages');
    channel2.bind('inserted', (data) => {
      setMessages([...messages, data]);
    });

    return () => {
      channel2.unbind_all();
      channel2.unsubscribe();
    }
  }, [messages]);

  const sendMessage = async (event) => {
    event.preventDefault();

    axios.post(`/new/message`, {
      message: input,
      name: user.displayName,
      room: roomId
    })
    setInput('');
  }


  const scrollToRef = (ref) => window.scrollTo(0, ref.current.offsetTop)
  const myRef = useRef(null)
  const executeScroll = () => scrollToRef(myRef)



  return (
    <div className='chat'>
      <div className='chat__header'>
        <Avatar src={room[0] ? room[0].img_url : ""} />

        <div className='chat__headerInfo'>
          <h3>{room[0] ? room[0].name : ""}</h3>
          <p>{messages.length > 0 ? `Last message: ${new Date(messages[messages.length - 1].updatedAt).toLocaleTimeString()} ${new Date(messages[messages.length - 1].updatedAt).toLocaleDateString()}` : ""}</p>
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

      <div className='chat__body' ref={myRef}>
        {messages.map((message) => (
          <Message key={message._id} message={message.message} name={message.name} updatedAt={message.updatedAt} />
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
