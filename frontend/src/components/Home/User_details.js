import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import axios from 'axios';

import urls from '../Api_Urls';

import FemaleLogo from '../../images/Employee_female.png';
import MaleLogo from '../../images/Employee_male.png';
import Locationpng from '../../images/location.png';
import Emailpng from '../../images/email.png';
import PhoneNumberpng from '../../images/phone-number.png';
import Datepng from '../../images/Date.png';
import BloodGrppng from '../../images/BloodGrp.png';


import { fetchUser } from '../../redux/reducers/authSlice';
import "../../Css/User_details.css";
const User_details = () => {
  const dispatch =useDispatch()
  const { token, user ,is_user} = useSelector((state) => state.auth);
  const [skills, setSkills] = useState([]);
  const [extraSkill,setExtraSkill]=useState(false)
  const [skillReq,setSkillReq] = useState("")
  const formatToSimpleDate = (date) =>
    date !== null && date !== undefined ? format(new Date(date), "dd-MM-y") : undefined;

  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...user });

  const toggleAccordion = async () => {
    async function fetchEmployeeSkills() {
      if (token) {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        };

        try {
          const res = await axios.get(urls.get_user_skills, config);
          setSkills(res.data);
        } catch (err) {
          alert(`Error msg in fetching user skills:${err} `);
        }
      }
    }

    !isAccordionOpen && fetchEmployeeSkills();
    setIsAccordionOpen(!isAccordionOpen);
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    console.log('Saved:', editedUser);
    if (token) {
      const config = {
          headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
          },
      };

      try {
          console.log(urls.get_skills)
          const res = await axios.put(urls.get_user,editedUser , config);
          console.log(res)
          dispatch(fetchUser(res.data));
      } catch (err) {
          alert(`Error msg :${err.response.data}`);
      }
  }
    setIsEditing(false);
  };

  const requestSkill = async () =>{
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    };
    try{
      const res=await axios.post(urls.req_skill,{
        "message":`${user.username} requested ${skillReq}`,
        "is_seen":false
      },config)
    }
    catch{
      alert("error in requesting skill")
    }
    setExtraSkill(!extraSkill)
  }

  return (
    <div className="card p-2 mt-3 mx-2 border">
      <div className="d-flex justify-content-end">
        <button type="button" className="btn btn-primary" onClick={toggleEdit}>
          {isEditing ? 'Cancel' : 'Edit'}
        </button>
      </div>
      <div className="mx-auto text-center  p-2 border-2 border-bottom border-secondary-subtle">
        <img src={user.emp_gender === 'Male' ? MaleLogo : FemaleLogo} alt="Profile" width="100" />
        <h3>{isEditing ? (
          <div className='d-flex'>
            <input className='name_input' type="text" name="first_name" value={editedUser.first_name} onChange={handleChange} />
            <input  className='name_input' type="text" name="last_name" value={editedUser.last_name} onChange={handleChange} />
          </div>
        ) : (
          `${user.first_name} ${user.last_name}`
        )}</h3>
        <p>
          {user.emp_designation.designation}</p>
      </div>
      <div className="p-2">
        <table className="table table-borderless small">
          <tbody>
            <tr>
              <td width="25px"><img width="25px" src={Locationpng} alt="Location" /></td>
              <td>
                {isEditing ? (
                  <input type="text" name="contact_address" value={editedUser.contact_address} onChange={handleChange} />
                ) : (
                  user.contact_address
                )}
              </td>
            </tr>
            <tr>
              <td width="25px"><img width="25px" src={Emailpng} alt="Email" /></td>
              <td>
                {isEditing ? (
                  <input type="text" name="email" value={editedUser.email} onChange={handleChange} />
                ) : (
                  user.email
                )}
              </td>
            </tr>
            <tr>
              <td width="25px"><img width="25px" src={Datepng} alt="Date Joined" /></td>
              <td>
                {isEditing ? (
                  <input type="text" name="date_joined" value={formatToSimpleDate(editedUser.date_joined)} onChange={handleChange} />
                ) : (
                  formatToSimpleDate(user.date_joined)
                )}
              </td>
            </tr>
            <tr>
              <td width="25px"><img width="25px" src={BloodGrppng} alt="Blood Group" /></td>
              <td>
                {isEditing ? (
                  <input type="text" name="blood_group" value={editedUser.blood_group} onChange={handleChange} />
                ) : (
                  user.blood_group
                )}
              </td>
            </tr>
          </tbody>
        </table>
        {isEditing && <button onClick={handleSave}>Save</button>}
      </div>

   {is_user&&   <div className="accordion accordion-flush col-7" id="accordionFlushExample">
        <div className="accordion-item">
          <h2 className="accordion-header" id="flush-headingOne">
            <button
              className={`accordion-button ${isAccordionOpen ? '' : 'collapsed'}`}
              type="button"
              onClick={toggleAccordion}
              aria-expanded={isAccordionOpen}
              aria-controls="flush-collapseOne"
            >
              My Skills
            </button>
          </h2>
          <div
            id="flush-collapseOne"
            className={`accordion-collapse collapse ${isAccordionOpen ? 'show' : ''}`}
            aria-labelledby="flush-headingOne"
            data-bs-parent="#accordionFlushExample"
          >
            <div className="accordion-body">
              <table className="table table-borderless small">
                {skills && (
                  <tbody>
                    {skills.map(skill => (
                      <tr key={skill.id}>
                        <td>{skill.skill_info.skill}</td>
                        <td>-</td>
                        <td>{skill.expertise_level}</td>
                      </tr>
                    ))}
                  </tbody>
                )}
                              </table>
                {extraSkill ? <div className='m-2'>
                <input name='extraSkill' type='text' onChange={e => setSkillReq(e.target.value)} placeholder='requesting Skill'></input>
                <button className='m-2' onClick={() =>requestSkill()}>Submit</button>
                </div>:
                <div>
                <button  className='m-0 p-1 btn btn-primary' onClick={() =>setExtraSkill(!extraSkill)}>Request Skill</button>
                </div>}
            </div>
          </div>
        </div>
      </div>}

    </div>
  );
};

export default User_details;
