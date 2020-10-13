import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Axios from 'axios';
import M from 'materialize-css';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState('');
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append('file', image);
    form.append('upload_preset', 'insta-elgendy');
    form.append('cloud_name', 'amrelgendy');

    try {
      if (image) {
        const {
          data: { secure_url },
        } = await Axios.post(
          'https://api.cloudinary.com/v1_1/amrelgendy/image/upload',
          form
        );
        const photo = secure_url;
        const user = { name, email, password, photo };
        const { data } = await Axios.post('/signup', user);
        if (data.error) {
          M.toast({ html: data.error, classes: 'red' });
        } else {
          M.toast({ html: data.msg, classes: 'green' });
          history.push('/login');
        }
      } else {
        const user = { name, email, password };
        const { data } = await Axios.post('/signup', user);
        if (data.error) {
          M.toast({ html: data.error, classes: 'red' });
        } else {
          M.toast({ html: data.msg, classes: 'green' });
          history.push('/login');
        }
      }
    } catch (error) {
      console.log(error);
    }
    setName('');
    setEmail('');
    setPassword('');
  };

  return (
    <div className='card signin center-align'>
      <h2>Instagram</h2>
      <input
        type='text'
        placeholder='name'
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
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
      <div className='file-field input-field'>
        <div className='btn grey darken-3'>
          <span>Uplaod Image</span>
          <input type='file' onChange={(e) => setImage(e.target.files[0])} />
        </div>
        <div className='file-path-wrapper'>
          <input className='file-path validate' type='text' />
        </div>
      </div>
      <button
        className='btn waves-effect waves-ligth grey darken-3'
        onClick={handleSubmit}
      >
        Sign up
      </button>
      <h5>
        <Link to='/login' style={{ color: 'black' }}>
          Already have an account
        </Link>
      </h5>
    </div>
  );
};

export default Signup;
