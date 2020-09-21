import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { Avatar } from '@material-ui/core';
import Pusher from 'pusher-js';
import './SidebarChat.css';
import axios from './axios';

function SidebarChat({ id, name, img, addNewChat }) {

  const [lastMessage, setLastMessage] = useState('');

  async function fetchLastMessage() {
    const lm = await axios.get(`/${id}/lastmessage`)
      .then(res => {
        setLastMessage(res.data);
      })
    return lm;
  }
  

  useEffect(() => {
    if(!addNewChat){
      fetchLastMessage()
    }
  }, [id]);


  useEffect(() => {
    const pusher = new Pusher('96ee846e6ca898a809de', {
      cluster: 'eu'
    });
    const channel3 = pusher.subscribe('pMessages');
    channel3.bind('inserted', (data) => {
      setLastMessage(data);
    });
    return () => {
      channel3.unbind_all();
      channel3.unsubscribe();
    }
  }, [lastMessage]);


  const createChat = () => {
    const roomName = String(prompt("Please enter room name and image (space( ) to separate):"))
    const [name, image] = roomName.split(/[ ]+/)

    if (name && image) {
      const rooms = axios.post('/new/room', {
        "name": name,
        "img_url": image,
      })
      return rooms;
    }
  };

  return !addNewChat ? (
    <Link to={`/room/${id}`}>
      <div className='sidebarChat'>
        <Avatar src={img} />
        <div className='sidebarChat__info'>
          <h2>{name}</h2>
          <p>{`${lastMessage?.message}`}</p>
          <p className='sidebarChat__datetime'>{`${new Date(lastMessage?.updatedAt).toLocaleTimeString()} ${new Date(lastMessage?.updatedAt).toLocaleDateString()}`}</p>
        </div>
      </div>
    </Link>
  ) : (
      <div>
        <div className='sidebarChat' onClick={createChat}>
          <h2>Add New Chat</h2>
        </div>
      </div>
    )
}

export default SidebarChat
