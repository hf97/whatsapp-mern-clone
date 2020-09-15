import React from 'react';
import './Message.css';
import { useStateValue } from './StateProvider';

function Message({ name, message, updatedAt}) {
  const [{ user }] = useStateValue();
  
  const date = new Date(updatedAt);

  return (
    <div className='message'>
      <div className="message__body">
        <p className={`message__message ${name === user.displayName && "message__reciever"}`}>
          <span className='message__name'>
            {name}
          </span>
          <span>{message}</span>
          <span className='message__timestamp'>
            {date.toLocaleTimeString()} {date.toLocaleDateString()}
          </span>
        </p>
      </div>
    </div>
  )
}

export default Message
