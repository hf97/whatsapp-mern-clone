import React from 'react';
import './Message.css';

function Message({ name, message, updatedAt}) {
  
  const date = new Date(updatedAt);

  return (
    <div className='message'>
      <div className="message__body">
        <p className={`message__message ${name === "Hugo" && "message__reciever"}`}>
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
