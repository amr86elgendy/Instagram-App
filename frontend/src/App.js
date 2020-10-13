import React, { useEffect, createContext, useReducer } from 'react';
import Navbar from './Components/Navbar';
import { Route, Switch, useHistory } from 'react-router-dom';
import Home from './Pages/Home';
import Signup from './Pages/Signup';
import Login from './Pages/Login';
import Profile from './Pages/Profile';
import OtherProfile from './Pages/OtherProfile';
import CreatePost from './Pages/CreatePost';
import { userReducer, initState } from './Reducers/userReducer';
import FollowingPosts from './Pages/followingPosts';

export const UserContext = createContext();

function App() {

  const history = useHistory();
  const [state, dispatch] = useReducer(userReducer, initState)
  useEffect(() => {
    
    const user = JSON.parse(localStorage.getItem('userInfo'));
    if (user) {
      dispatch({ type: 'USER', payload: user });
    } else {
      // Redirect User to Login when open App
      history.push('/login')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <Navbar />
      <Switch>
        <Route exact path='/' component={Home} />
        <Route path='/signup' component={Signup} />
        <Route path='/login' component={Login} />
        <Route exact path='/profile' component={Profile} />
        <Route path='/profile/:userId' component={OtherProfile} />
        <Route path='/create' component={CreatePost} />
        <Route path='/followingposts' component={FollowingPosts} />
      </Switch>
    </UserContext.Provider>
  );
}

export default App;
