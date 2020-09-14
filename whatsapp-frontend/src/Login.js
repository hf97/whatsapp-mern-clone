import React from 'react';
import { Button } from '@material-ui/core';
import './Login.css';
import { auth, provider } from './firebase';
import { useStateValue } from './StateProvider';
import { actionTypes } from './Reducer';

function Login() {
  //{} = state
  const [{}, dispatch] = useStateValue();

  const signIn = () => {
    auth
      .signInWithPopup(provider)
      .then((result) => {
        dispatch({
          type: actionTypes.SET_USER,
          user: result.user,
        });
      })
      .catch(error => alert(error.message))
  }

  return (
    <div className='login'>
      <div className='login__container'>
        <img
          src='http://www.vectorico.com/wp-content/uploads/2018/02/Whatsapp-Icon-300x300.png'
          alt='whatsapp logo'
        />
        <div className='login__text'>
          <h1>Sign in to WhatsApp</h1>
        </div>

        <Button type='submit' onClick={signIn}>
          Sign in with Google
        </Button>
      </div>
    </div>
  )
};

export default Login
