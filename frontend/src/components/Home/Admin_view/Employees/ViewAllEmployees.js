import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';

import urls from '../../../Api_Urls';
import Employee_Card from './Employee_Card';
import {  useNavigate } from 'react-router-dom';

const ViewAllEmployees = () => {
  const [employees, setEmployees] = useState([])
  const { token,is_user } = useSelector((state) => state.auth);
 
  const navigate = useNavigate();
  useEffect(() => {
    async function fetchAllEmployees() {
      if (token) {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        };
        try {
          const res = await axios.get(urls.get_all_emp, config);
          setEmployees(res.data)
        } catch (err) {
          alert(`Error msg :${err}`);
        }
      }
    }
    if (token == null) {
      navigate("/login")
    }
    else if (is_user) {
      navigate("/home");
    }
    else 
    fetchAllEmployees();
  }, [])

  const employeeAddHandler = () => {
    navigate("/add_emp")
  }

  return (

    <div className="container">
      {console.log(is_user, "viewall")}
      <div className='d-flex justify-content-end'>
        <div className=' btn  btn-primary my-3' onClick={employeeAddHandler}>Add employee</div>
      </div>
      <div className="row">
        {
          employees.map(emp => !emp.is_superuser && <div className="col-lg-4 col-md-5 col-sm-6 col-xs-12">
            <Employee_Card key="emp.id" user={emp} />
          </div>)
        }

      </div>

    </div>
  )
}

export default ViewAllEmployees;