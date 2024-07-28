import { useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import urls from '../../../Api_Urls';
import ShowSkills from '../ShowSkills';


const ShowEmployeeSkills = ({ user }) => {
  const { token } = useSelector((state) => state.auth);
  const [skills, setSkills] = useState([])
  const [isEditing, setIsEditing] = useState(false);

 

  const fetchEmployeeSkills = async () => {
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
        const res = await axios.get(urls.get_emp_skills + user.id, config);
        console.log(res.data)
        setSkills(res.data)
      } catch (err) {
        alert(`Error in fetching employee skills :${err}`);
      }
    }
  }
 
  const handleSaveSkills = async () => {
    console.log("hello")
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      skills.map(async skill => {if(skill.skill_info?.skill){ await axios.put(urls.get_emp_skills + user.id, skill, config)}else{
        alert("add required skill")
        return
      } })
      fetchEmployeeSkills();
      setIsEditing(false);

    } catch (err) {
      alert(`Error saving skills: ${err}`);
    }
  };

 
  const handleAddSkill = () => {
    // initializing the new skill
    setSkills([
      ...skills,
      {
        employee: user.id,
        skill_info: { skill: '', id: null },
        expertiseLevel: 'BG',
        expertise_level: 'Beginner',
      },
    ]);

  };

  const handleDeleteSkill = async (index) => {
    if (skills[index]['id']) {
      try {
        console.log(skills[index])
        const res = await axios.delete(urls.get_emp_skills + user.id,
          {
            data: skills[index], headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          })
        if (res) {
          fetchEmployeeSkills(); // may be not required
        }

      } catch (err) {
        alert(`Error in saving skills: ${err}`);
      }
    }
    else {
      console.log("not id")
      const updatedSkills = [...skills];
      updatedSkills.splice(index, 1); 
      setSkills(updatedSkills);
    }

  };
  return (
    <ShowSkills handleDeleteSkill={handleDeleteSkill} handleAddSkill={handleAddSkill} handleSaveSkills={handleSaveSkills} skills={skills} setSkills={setSkills} fetchSkills={fetchEmployeeSkills}
    isEditing={isEditing} setIsEditing={setIsEditing}/>
  )
}

export default ShowEmployeeSkills;
