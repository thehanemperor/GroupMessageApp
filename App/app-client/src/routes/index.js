import React from 'react';
import {
  BrowserRouter,
  Route,
  Switch,
  Redirect
} from 'react-router-dom'

import Home from './Home'
import Register from './Register'
import Login from './Login';
import Test from './Test';
import CreateTeam from './CreateTeam';
import ViewTeam from './ViewTeam'
import decode from 'jwt-decode'



const isAuthenticated =()=>{
  const token = localStorage.getItem('token')
  const refreshToken = localStorage.getItem('refreshToken')

  try{
    decode(token)
    const { exp } = decode(refreshToken);
    if (Date.now()/1000 > exp){
      return false
    }
  }catch (err){
    return false
  }
  return true
};


const PrivateRoute = ({component: Component, ...rest})=>(
  <Route 
  {...rest}
   render = {props => 
    (isAuthenticated() ? (
      <Component {...props}/>
    ):(
      <Redirect to={{
        pathname: '/login',
        
      }} />
    ))}
  
  
  />
)

export default ()=> (
  <BrowserRouter>
    <Switch>
        <Route path="/" exact component = {Home} />
        <Route path="/register" exact component = {Register} />
        <Route path="/login" exact component = {Login} />
        <PrivateRoute path="/create-team" exact component ={CreateTeam}/>
        <PrivateRoute path="/view-team/:teamId?/:channelId?" exact component={ViewTeam}/>
        <Route path="/test" exact component = {Test}/>
    </Switch>
  </BrowserRouter>
);
