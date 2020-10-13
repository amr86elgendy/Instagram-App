import React, { useContext, useRef, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { UserContext } from '../App';
import M from 'materialize-css';
import Axios from 'axios';
Axios.defaults.baseURL = 'http://localhost:5000';

const Navbar = () => {
  const history = useHistory();
  const searchModal = useRef(null);
  const [search, setSearch] = useState('');
  const [usersList, setUsersList] = useState([]);
  const { state, dispatch } = useContext(UserContext);

  useEffect(() => {
    M.Modal.init(searchModal.current);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    dispatch({ type: 'LOGOUT' });
    history.push('/login');
  };

  const fetch_users_on_search = async (query) => {
    setSearch(query);
    const {
      data: { users },
    } = await Axios.post(
      '/user/search',
      { query },
      {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      }
    );
    setUsersList(users);
  };

  return (
    <nav>
      <div
        className='nav-wrapper grey darken-3'
        style={{ paddingLeft: '20px', paddingRight: '20px' }}
      >
        <Link
          to={localStorage.getItem('token') ? '/' : '/login'}
          className='brand-logo'
        >
          instagram
        </Link>
        {localStorage.getItem('token') ? (
          <ul id='nav-mobile' className='right hide-on-med-and-down'>
            <li>
              <i
                data-target='modal1'
                className='large material-icons modal-trigger'
              >
                search
              </i>
            </li>
            <li>
              <Link to='/profile'>Profile</Link>
            </li>
            <li>
              <Link to='/create'>Create Post</Link>
            </li>
            <li>
              <Link to='/followingposts'>My Following Posts</Link>
            </li>
            <li>
              <button className='btn red darken-3' onClick={handleLogout}>
                Logout
              </button>
            </li>
          </ul>
        ) : (
          <ul id='nav-mobile' className='right hide-on-med-and-down'>
            <li>
              <Link to='/login'>Login</Link>
            </li>
            <li>
              <Link to='/signup'>Signup</Link>
            </li>
          </ul>
        )}
      </div>
      <div className='modal' id='modal1' ref={searchModal}>
        <div className='modal-content'>
          <input
            type='text'
            placeholder='Search friends'
            value={search}
            onChange={(e) => fetch_users_on_search(e.target.value)}
          />
          <ul className='collection'>
            {usersList &&
              usersList.map((user) => {
                return (
                  <li key={user._id} className='collection-item'>
                    <Link
                      className='black-text'
                      to={
                        user._id !== state._id
                          ? `/profile/${user._id}`
                          : '/profile'
                      }
                      onClick={() => {
                        M.Modal.getInstance(searchModal.current).close();
                        setSearch([]);
                      }}
                    >
                      {user.email}
                    </Link>
                  </li>
                );
              })}
          </ul>
        </div>
        <div className='modal-footer'>
          <button
            className='modal-close waves-effect waves-green btn-flat'
            onClick={() => setSearch([])}
          >
            Close
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
