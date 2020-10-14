import React from 'react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Axios from 'axios';
import M from 'materialize-css';
// Axios.defaults.baseURL = 'http://localhost:5000';


const CreatePost = () => {
  const history = useHistory();

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [image, setImage] = useState('');

  const handleSubmit = async () => {

    const form = new FormData();
    form.append('file', image);
    form.append('upload_preset', 'insta-elgendy');
    form.append('cloud_name', 'amrelgendy');
    try {
      const {
        data: {secure_url}
      } = await Axios.post('https://api.cloudinary.com/v1_1/amrelgendy/image/upload',
      form
      );
      const photo = secure_url;
      const post = { title, body, photo };
      const { data } = await Axios.post('/posts/create',
        post,
        {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
        }
      );
      M.toast({ html: data.msg, classes: 'green' });
      history.push('/');
    } catch (error) {
      console.log(error);
      M.toast({ html: error.message, classes: 'green' });
    }
  };

  return (
    <div
      className='card input-field'
      style={{
        margin: '30px auto',
        maxWidth: '500px',
        padding: '20px',
        textAlign: 'center',
      }}
    >
      <input
        type='text'
        placeholder='title'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type='text'
        placeholder='body'
        value={body}
        onChange={(e) => setBody(e.target.value)}
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
        className='btn waves-effect waves-light grey darken-3'
        onClick={handleSubmit}
      >
        Submit post
      </button>
    </div>
  );
};

export default CreatePost;
