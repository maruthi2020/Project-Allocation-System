import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import urls from '../../../Api_Urls';
import Show_Suggested_employees from './Show_Suggested_employees';

const Get_suggested_Employees = ({ project, skillsHasChanges, suggEmpHasChanges, setsuggEmpHasChanges }) => {
  const { token } = useSelector((state) => state.auth);
  const [employeeList, setEmployeeList] = useState([])

  const handleSuggestedEmployees = async () => {
    if (token) {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      };
      try {
        const response = await axios.get(urls.get_suggested_emp + project.id, config);
        setEmployeeList(response.data)
        console.log(response.data, "sug")
      } catch (err) {
        alert(`Error in fetching skills: ${err}`);
      }
    }

  }

  useEffect(() => {
    handleSuggestedEmployees()
    console.log("sugg")
  }, [skillsHasChanges, suggEmpHasChanges])
  if (token == null) return <Navigate to="/login" />;
  return (
    <div className="card p-2 mt-3 mx-2 ">

      {
        employeeList.length == 0 ? <h1 className='p-4'>No employee has the required skill set</h1> : <>
          <h4>Sugggested Employees</h4>
          <Show_Suggested_employees employeeList={employeeList} project={project} setsuggEmpHasChanges={setsuggEmpHasChanges} suggEmpHasChanges={suggEmpHasChanges} />
        </>

      }
    </div>
  )
}

export default Get_suggested_Employees;