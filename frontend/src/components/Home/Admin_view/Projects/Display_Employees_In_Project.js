import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import urls from '../../../Api_Urls';
import { MdOutlineDelete } from 'react-icons/md';

const Display_Employees_In_Project = ({ project, skillsHasChanges, suggEmpHasChanges ,setsuggEmpHasChanges }) => {
  const { token ,username ,is_user} = useSelector((state) => state.auth);
  const [employees, setEmployees] = useState([]);
  // const username = localStorage.getItem("username")
  const fetchEmployees = async () => {
    if (token) {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      };

      try {
        const res = await axios.get(urls.get_emps_in_proj + project.id, config);
        setEmployees(res.data);
      } catch (err) {
        alert(`Error while fetching employees in the project: ${err}`);
      }
    }
  };

  const handleDelete = async (eid) => {
    if (token) {
      const config = {
        data :{
          employee:eid
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      };

      try {
        const res = await axios.delete(urls.get_emps_in_proj + project.id, config);
        setsuggEmpHasChanges(!suggEmpHasChanges)
        fetchEmployees()
      } catch (err) {
        alert(`Error while fetching employees in the project: ${err}`);
      }
  }}
  useEffect(() => {
    fetchEmployees();
  }, [token, project.id, skillsHasChanges, suggEmpHasChanges]);

  return (
    <div className='card'>
      <div className='card-header'>
        <h5 className='card-title'>Employees in Project</h5>
      </div>
      <div className='card-body'>
        <div className='table-responsive'>
          <table className='table table-bordered table-hover'>
            <thead className='thead-light'>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Joined Date</th>
                <th>Designation</th>
                {!is_user && <th>remove</th>}
              </tr>
            </thead>
            <tbody>
              {employees!=null && employees.map((employee) => (
                <tr key={employee.id}>
                  <td>{employee.username}</td>
                  <td>{employee.email}</td>
                  <td>{new Date(employee.date_joined).toLocaleDateString()}</td>
                  <td>{employee.emp_designation.designation} </td>
                 {employee.username !=username &&  !is_user&& <td>  <button className='btn btn-danger m-2 p-1 rounded-circle' onClick={() => handleDelete(employee.id)} ><MdOutlineDelete /></button></td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Display_Employees_In_Project;
