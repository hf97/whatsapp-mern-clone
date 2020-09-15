import React from 'react';
import { Link } from "react-router-dom";
import { Avatar } from '@material-ui/core';
import './SidebarChat.css';
import axios from './axios';

function SidebarChat({ id, name, img, addNewChat }) {

  const createChat = () => {
    const roomName = String(prompt("Please enter room name and image (space( ) to separate):"))
    const [name, image] = roomName.split(/[ ]+/)

    if(name && image){
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
