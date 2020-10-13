import React, { useContext, useEffect, useState } from 'react';
import Axios from 'axios';
import { UserContext } from '../App';

const Profile = () => {

  const [myPosts, setMyPosts] = useState([]);
  const [image, setImage] = useState('');
  const { state, dispatch } = useContext(UserContext);

  useEffect(() => {
    async function fetchData() {
      const { data } = await Axios.get('/posts/me', {headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    }});
    setMyPosts(data.myPosts);
  }
  fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [])

  const updatePhoto = async () => {
    
    const form = new FormData();
    form.append('file', image);
    form.append('upload_preset', 'insta-elgendy');
    form.append('cloud_name', 'amrelgendy');

    const {
      data: { secure_url },
    } = await Axios.post(
      'https://api.cloudinary.com/v1_1/amrelgendy/image/upload',
      form
    );
    const photo = secure_url;
    const { data: {user} } = await Axios.put('/user/updatephoto', {photo}, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    });
    localStorage.setItem('userInfo', JSON.stringify(user));
    dispatch({ type: 'UPDATE_PHOTO', payload: user });
    
    window.location.reload()
  }

  return (
    <div style={{ maxWidth: '550px', margin: '0px auto' }}>
      <div
        style={{
          margin: '18px 0px',
          borderBottom: '1px solid grey',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
          }}
        >
          <div>
            <img
              style={{ width: '160px', height: '160px', borderRadius: '80px' }}
              src={state ? state.photo : 'loading'}
              alt={state && state.name}
            />
          </div>
          <div>
            <h4>{state ? state.name : 'loading'}</h4>
            <h5>{state ? state.email : 'loading'}</h5>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '108%',
              }}
            >
              <h6>{myPosts.length} posts</h6>
              <h6>{state ? state.followers.length : '0'} followers</h6>
              <h6>{state ? state.following.length : '0'} following</h6>
            </div>
          </div>
        </div>

        <div className='file-field input-field' style={{ margin: '10px' }}>
          <div className='btn grey darken-3'>
            <span>Select photo</span>
            <input
              type='file'
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>
          <div className='file-path-wrapper'>
            <input className='file-path validate' type='text' />
          </div>
        </div>
      </div>
      <button className='btn red submit-upd-photo' onClick={updatePhoto}>Updata</button>
      <div className='gallery'>
        {myPosts.map((post) => {
          const { _id, title, photo } = post;
          return (
            <img
              key={_id}
              className='item'
              src={photo}
              alt={title}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Profile;
