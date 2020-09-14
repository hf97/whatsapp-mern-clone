import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Pusher from 'pusher-js';
import './App.css';
import Sidebar from './Sidebar';
import Chat from './Chat';
import axios from './axios';
import Login from './Login';
import { useStateValue } from './StateProvider';

function App() {
  const [{ user }, dispatch] = useStateValue();
  const [rooms, setRooms] = useState([]);

  async function fetchRooms() {
    const rooms = await axios.get('/get/rooms')
      .then(res => {
        setRooms(res.data);
      });
    return rooms;
  }

  useEffect(() => {
    fetchRooms();
  }, [])

  useEffect(() => {
    const pusher = new Pusher('96ee846e6ca898a809de', {
      cluster: 'eu'
    });

    const channel1 = pusher.subscribe('pRooms');
    channel1.bind('inserted', (data) => {
      setRooms([...rooms, data]);
    });

    return () => {
      channel1.unbind_all();
      channel1.unsubscribe();
    }
  }, [rooms]);

  return (
    <div className="app">
      <div className='app__body'>
        {!user ? (
          <Login />
        ) : (
            <Router>
              <Sidebar rooms={rooms} />
              <Switch>
                <Route path='/room/:roomId'>
                  <Chat rooms />
                </Route>
                <Route path='/'>
                  <Chat rooms />
                </Route>
              </Switch>
            </Router>
          )}
      </div>
    </div>
  );
}

export default App;
