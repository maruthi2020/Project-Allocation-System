import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { loginUser } from '../redux/reducers/authSlice';
import urls from './Api_Urls';
import Logo from '../images/beehyvlogo.png';

const Login = () => {
  const { token } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const [data, setData] = useState({
    username: '',
    password: ''
  });

  const { username, password } = data;

  const changeHandler = event => {
    setData(prev => ({ ...prev, [event.target.name]: event.target.value }));
  };

  async function handleLogin() {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    const body = JSON.stringify({ username, password });
    try {
      const res = await axios.post(urls.login, body, config);
      dispatch(loginUser(res.data));
    } catch (err) {
      if(err.response == null)
      {
        alert(`Error msg :${err}`);
      }
      else if(err.response.status==400)
      alert(`Invalid Credentials`);
    else
    alert(`Error msg :${err.response.status}`);
    }
  }

  const submitHandler = async event => {
    event.preventDefault();
    await handleLogin(username, password);
  };

  if (token != null) {
    return <Navigate to="/home" />;
  }

  return (
    <div className='bg-primary d-flex justify-content-center align-items-center'
      style={{
        minHeight: '93vh',
        background: ' rgb(44,107,122)',
        background: 'linear-gradient(90deg, rgba(44,107,122,1) 0%, rgba(9,121,61,1) 0%, rgba(6,161,129,1) 22%, rgba(0,236,255,1) 100%)'
      }}>
      <div className="container border  border-2 p-5" style={{ maxWidth: '450px', minWidth: '250px', width: '75%' }}>
        <div className='d-flex justify-content-between align-items-center mb-4'>
          <img src={Logo} alt="Logo" className="logo-image mr-3" style={{ maxWidth: '100px', minWidth: '25px' }} />
          <h2 className="text-center mb-0">Login Page</h2>
          <span></span>
        </div>
        <form onSubmit={submitHandler} className="login-form">
          <div className="form-group my-3">
            {/* <label htmlFor="username" className="mb-1">Username/Email</label> */}
            <input
              type="text"
              className="form-control"
              id="username"
              name="username"
              value={username}
              onChange={changeHandler}
              placeholder="Enter username/email"
            />
          </div>
          <div className="form-group my-3">
            {/* <label htmlFor="password" className="mb-1">Password</label> */}
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={password}
              onChange={changeHandler}
              placeholder="Enter password"
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block mt-4" style={{width:'50%'}}>Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
