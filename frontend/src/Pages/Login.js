import React from 'react';
import { useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Axios from 'axios';
import M from 'materialize-css';
import { UserContext } from '../App';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const history = useHistory();
  const { state, dispatch } = useContext(UserContext)

  const handleSubmit = async (e) => {
    const user = { email, password };
    e.preventDefault();
    try {
      const { data } = await Axios.post('/signin', user);
      if (data.error) {
        M.toast({ html: data.error, classes: 'red' });
      } else {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userInfo', JSON.stringify(data.user));
        // Change State after Login
        dispatch({ type: 'USER', payload: data.user})
        
        M.toast({ html: data.msg, classes: 'green' });
        history.push('/');
      }
    } catch (error) {
      console.log(error);
    }
    setEmail('');
    setPassword('');
  };

  return (
    <div className='card signin center-align'>
      <h2>Instagram</h2>
      <input
        type='text'
        placeholder='email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type='password'
        placeholder='password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className='btn waves-effect waves-ligth grey darken-3'
        onClick={handleSubmit}
      >
        Login
      </button>
      <h5>
        <Link to='/signup' style={{ color: 'black' }}>
          Create New Account
        </Link>
      </h5>
    </div>
  );
};

export default Login;
