import React, { useContext, useEffect, useState } from 'react';
import Axios from 'axios';
import { UserContext } from '../App';
import { useParams } from 'react-router-dom';
//Axios.defaults.baseURL = 'http://localhost:5000';

const OtherProfile = () => {
  
  const [userPosts, setUserPosts] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const { state, dispatch } = useContext(UserContext);


  const { userId } = useParams();
  const [showFollow, setShowFollow] = useState(state ? !state.following.includes(userId) : true);
  

  useEffect(() => {
    async function fetchData() {
      const {
        data: { user, userPosts },
      } = await Axios.get(`/user/${userId}`, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      });
      // console.log(user, userPosts);
      setUserProfile(user);
      setUserPosts(userPosts);
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const followUser = async () => {
    const { data: {userFollowed, userFollower} } = await Axios.put('/user/follow', {id: userId}, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    });
    //console.log(userFollowed);
    dispatch({ type: 'UPDATE', payload: userFollower });
    localStorage.setItem('userInfo', JSON.stringify(userFollower));
    setUserProfile(userFollowed)
    setShowFollow(false)
  };

  const unfollowUser = async () => {
    const { data: {userFollowed, userFollower} } = await Axios.put('/user/unfollow', {id: userId}, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    });
    dispatch({ type: 'UPDATE', payload: userFollower });
    localStorage.setItem('userInfo', JSON.stringify(userFollower));
    setUserProfile(userFollowed)
    setShowFollow(true)
  };

  return (
    <>
      {userProfile ? (
        <div style={{ maxWidth: '550px', margin: '0px auto' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              margin: '18px 0px',
              borderBottom: '1px solid grey',
            }}
          >
            <div>
              <img
                style={{
                  width: '160px',
                  height: '160px',
                  borderRadius: '80px',
                }}
                src={userProfile.photo}
                alt={userProfile.name}
              />
            </div>
            <div>
              <h4>{userProfile.name}</h4>
              <h5>{userProfile.email}</h5>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '108%',
                }}
              >
                <h6>{userPosts.length} posts</h6>
                <h6>{userProfile.followers.length} followers</h6>
                <h6>{userProfile.following.length} following</h6>
              </div>
              {showFollow ? (
                <button
                  style={{
                    margin: '10px',
                  }}
                  className='btn waves-effect waves-light #64b5f6 blue darken-1'
                  onClick={followUser}
                >
                  Follow
                </button>
              ) : (
                <button
                  style={{
                    margin: '10px',
                  }}
                  className='btn waves-effect waves-light #64b5f6 red darken-1'
                  onClick={unfollowUser}
                >
                  UnFollow
                </button>
              )}
            </div>
          </div>

          <div className='gallery'>
            {userPosts.map((item) => {
              return (
                <img
                  key={item._id}
                  className='item'
                  src={item.photo}
                  alt={item.title}
                />
              );
            })}
          </div>
        </div>
      ) : (
        <h2>loading...!</h2>
      )}
    </>
  );
};

export default OtherProfile;
