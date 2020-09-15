import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar, IconButton } from '@material-ui/core';
import { SearchOutlined } from '@material-ui/icons';
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import ChatIcon from '@material-ui/icons/Chat';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import './Sidebar.css';
import SidebarChat from './SidebarChat';
import { useStateValue } from './StateProvider';



function Sidebar({ rooms }) {
  const [{ user}] = useStateValue();

  return (
    <div className='sidebar'>
      <div className='sidebar__header'>
        <Link to='/'>
          <Avatar src={user?.photoURL} alt='user image' />
        </Link>
        <div className='sidebar__headerRight'>
          <IconButton>
            <DonutLargeIcon />
          </IconButton>
          <IconButton>
            <ChatIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>

      <div className='sidebar__search'>
        <div className='sidebar__searchContainer'>
          <SearchOutlined />
          <input placeholder="Search or start new chat" type='text' />
        </div>
      </div>

      <div className='sidebar__chats'>
        <SidebarChat key="add" addNewChat />
        {rooms.map(room => (
          <SidebarChat key={room._id} id={room._id} name={room.name} img={room.img_url} />
        ))}
      </div>
     </div>
  )
}

export default Sidebar
