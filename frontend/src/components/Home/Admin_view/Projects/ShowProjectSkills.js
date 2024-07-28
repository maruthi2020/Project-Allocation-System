import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import urls from '../../../Api_Urls';
import ShowSkills from '../ShowSkills';

const ShowProjectSkills = ({ project, skillsHasChanges, setSkillsHasChanges }) => {
  const { token,is_user } = useSelector((state) => state.auth);
  const [skills, setSkills] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchProjectSkills();
  }, []);

  const fetchProjectSkills = async () => {
    if (token) {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      };

      try {
        const res = await axios.get(urls.get_proj_skills + project.id, config);
        setSkills(res.data);
      } catch (err) {
        alert(`Error in fetching project skills: ${err}`);
      }
    }
  };


  const handleSaveSkills = async () => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      var answer = window.confirm("Are you want to delete Employees who don't have modified skill set? if yes press ok");
      if (answer) {
        const putRequests = skills.map((skill) => axios.put(urls.get_proj_skills + project.id, skill, config));
        await Promise.all(putRequests);
        await axios.get(urls.check_proj_alloc + project.id, config);
      }
      else {
        const putRequests = skills.map((skill) => axios.put(urls.get_proj_skills + project.id, skill, config));
        await Promise.all(putRequests);
      }
      setSkillsHasChanges(!skillsHasChanges);
      setIsEditing(false);
      fetchProjectSkills(); 
    } catch (err) {
      alert(`Error in saving skills: ${err}`);
    }
  };


  const handleAddSkill = () => {
    setSkills([
      ...skills,
      {
        project: project.id,
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
        const res = await axios.delete(urls.get_proj_skills + project.id,
          {
            data: skills[index], headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          })
        if (res) {
          setSkillsHasChanges(!skillsHasChanges);
          fetchProjectSkills(); // may be not required
        }

      } catch (err) {
        alert(`Error in saving skills: ${err}`);
      }
    }
    else {
      console.log("not id")
      const updatedSkills = [...skills];
      updatedSkills.splice(index, 1); // Remove the skill at the specified index
      setSkills(updatedSkills);
    }

  };


  return (
    <ShowSkills handleDeleteSkill={handleDeleteSkill} handleAddSkill={handleAddSkill} 
    handleSaveSkills={handleSaveSkills} skills={skills} setSkills={setSkills} 
    fetchSkills={fetchProjectSkills} 
    isEditing={isEditing} setIsEditing={setIsEditing}/>
  );
};

export default ShowProjectSkills;
