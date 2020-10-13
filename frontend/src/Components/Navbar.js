import React, { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { UserContext } from '../App';

const Navbar = () => {
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory()

  const handleLogout = () => {
    localStorage.clear();
    dispatch({ type: "LOGOUT" });
    history.push('/login')
  }
  
  return (
    <nav>
      <div className='nav-wrapper grey darken-3' style={{paddingLeft: '20px', paddingRight: '20px'}}>
        <Link to={state ? '/' : '/login'} className='brand-logo'>
          instagram
        </Link>
        {state ? (
          <ul id='nav-mobile' className='right hide-on-med-and-down'>
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
              <button
                className='btn red darken-3'
                onClick={handleLogout}
              >
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
    </nav>
  );
};

export default Navbar;
