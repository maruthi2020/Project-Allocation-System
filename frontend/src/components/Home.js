import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

import { fetchUser } from '../redux/reducers/authSlice';
import urls from './Api_Urls';
import Projects  from './Home/Projects';
import User_details from './Home/User_details';


export const Home = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);
  
     const fetchUserDetails = async () => {
      if (token) {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        };

        try {
          const res = await axios.get(urls.get_user, config);
          dispatch(fetchUser(res.data));
        } catch (err) {
          alert(`Error msg in fetching user details:${err}`);
        }
      }
      setLoading(false);
    }
  useEffect(() => {
    setLoading(true);
    fetchUserDetails();
  }, [token]);


  if (loading) {
    return <p>Loading...</p>;
  }
  if (token == null) return <Navigate to="/login" />;

  if (user) {
    return (
      <div className="container-fluid full-body">
        <div className="row justify-content-center">
            <div className="col-lg-3 col-md-5 col-sm-6 col-xs-12">
              <User_details />
              </div>
              <div className="col">
                <div className="card p-2 mt-3 mx-2   ">
                  <Projects/>
                </div>
              </div>
            </div>
          </div>
    );
  }
};

export default Home;
