import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import urls from '../../../Api_Urls';
import '../../../../Css/ShowSuggestedEmployees.css'; 



const Show_Suggested_employees = ({
    employeeList,
    project,
    setsuggEmpHasChanges,
    suggEmpHasChanges,
  }) => {
    const { token } = useSelector((state) => state.auth);
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [employeeSkills, setEmployeeSkills] = useState({});
  
    const handleCheckboxChange = (employeeId) => {
      setSelectedEmployees((prevSelected) =>
        prevSelected.includes(employeeId)
          ? prevSelected.filter((id) => id !== employeeId)
          : [...prevSelected, employeeId]
      );
    };
  
    const fetchEmployeeSkills = async (employeeId) => {
      if (token) {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        };
  
        try {
          const res = await axios.get(urls.get_emp_skills + employeeId, config);
          setEmployeeSkills((prevSkills) => ({
            ...prevSkills,
            [employeeId]: res.data,
          }));
        } catch (err) {
          console.error('Error fetching employee skills:', err);
        }
      }
    };
  
    const handleToggleSkills = async (employeeId) => {
      if (!employeeSkills[employeeId]) {
        await fetchEmployeeSkills(employeeId);
      } else {
        setEmployeeSkills((prevSkills) => ({
          ...prevSkills,
          [employeeId]: null, // Clear skills if already fetched
        }));
      }
    };
  
    const handleSubmit = async () => {
      if (token) {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        };
  
        try {
          await Promise.all(
            selectedEmployees.map((eid) =>
              axios.post(urls.get_emps_in_proj + project.id, { employee: eid }, config)
            )
          );
          setSelectedEmployees([]);
          setsuggEmpHasChanges(!suggEmpHasChanges); 
        } catch (err) {
          alert(`Error msg: ${err}`);
        }
      }
    };
    
    return (
      <div className='suggested-employees-container table-responsive'>
        <table className='table table-bordered'>
          <thead>
            <tr>
                <th style={{ width: '6rem' }}>Check box</th>
              <th>Employee</th>
              <th>Email</th>
              <th>Designation</th>
              <th>Skills</th>
            </tr>
          </thead>
          <tbody>
            {employeeList.map((employee) => (
              <tr key={employee.id}>
                <td>
                    <div style={{ width: '6rem' }}>
                    <input
                    type="checkbox"
                    checked={selectedEmployees.includes(employee.id)}
                    onChange={() => handleCheckboxChange(employee.id)}
                  />
                    </div>
                  
                </td>
                <td>{employee.username}</td>
                <td>{employee.email}</td>
                <td>{employee.emp_designation.designation}</td>
                <td>
                  <button
                    className='accordion-button'
                    onClick={() => handleToggleSkills(employee.id)}
                  >
                    {employeeSkills[employee.id] ? 'Hide Skills' : 'Show Skills'}
                  </button>
                  {employeeSkills[employee.id] && (
                    <ul className='skills-list'>
                      {employeeSkills[employee.id].map((skill) => (
                        <li key={skill.id}>{skill.skill_info.skill} - {skill.expertise_level}</li>
                      ))}
                    </ul>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className='btn btn-success' onClick={handleSubmit}>Select</div>
      </div>
    );
  };
  
  export default Show_Suggested_employees;