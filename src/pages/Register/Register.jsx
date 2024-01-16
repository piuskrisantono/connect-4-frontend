import React, { useEffect, useState } from 'react';
import './Register.css';
import { useNavigate } from 'react-router';
import Constant from '../../Constant';

export default function Register() {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem(Constant.LOCAL_STORAGE_PLAYER)) {
      navigate('/home');
      return;
    }
  }, [navigate])

  const onUsernameChange = (event) => {
    setUsername(event.target.value);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    if (username) {
      const id = username + Date.now();
      const player = { id, username };
      localStorage.setItem(Constant.LOCAL_STORAGE_PLAYER, JSON.stringify(player));
      navigate('/home');
    }
  }

  return (
    <form className='register-container' onSubmit={handleSubmit}>
      <h2>Enter Username</h2>
      <input className='username-input' value={username} onChange={onUsernameChange} placeholder="Username..." required />
      <button className='submit-button' type='submit'>Enter</button>
    </form>
  );
};
