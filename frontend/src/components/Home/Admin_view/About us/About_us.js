    import React, { useEffect, useState } from 'react'
    import axios from 'axios';
    import { useSelector } from 'react-redux';
    import {  useNavigate } from 'react-router-dom';
    import urls from '../../../Api_Urls';
    const About_us = () => {
        const { token,is_user } = useSelector((state) => state.auth);
        const [skills,setSkills] = useState([])
        const [newskill,setNewSkill] =useState("")
        const [designations,setDesignations] = useState([])
        const  [newDesignation,setNewDesignation] =useState("")
        const navigate = useNavigate();
        async function fetchSkills(){
            if (token) {
                const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
                };
                try {
                const res = await axios.get(urls.get_skills, config);
                setSkills(res.data)
                } catch (err) {
                alert(`Error msg :${err}`);
                }
            }
        }

        async function fetchDesignations(){
            if (token) {
                const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
                };
                try {
                const res = await axios.get(urls.get_deigsnations, config);
                setDesignations(res.data)
                } catch (err) {
                alert(`Error msg :${err}`);
                }
            }
        }

        if (token == null) {
            navigate("/login")
        }
        const handleDesBtn = async() =>{
            if (token) {
                const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
                };
                try {
                    console.log(newskill)
                const res = await axios.post(urls.get_deigsnations,{designation:newDesignation}, config);
                fetchDesignations();
                } catch (err) {
                alert(`Error msg :${err}`);
                }
        }
    }
        const handleSkillBtn= async ()=> {
            if (token) {
                const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
                };
                try {
                    console.log(newskill)
                const res = await axios.post(urls.get_skills,{skill:newskill}, config);
                fetchSkills();
                } catch (err) {
                alert(`Error msg :${err}`);
                }
            }
        }

        useEffect(()=>{
            fetchSkills();
            fetchDesignations();
        },[])
    return (
        <div className='d-flex justify-content-center'>
            <div className='container col-6 '>
            <div className='card  m-3 p-3' >
                <p className='h2 bg-info rounded-pill m-3 p-2'>Available skills</p>
                {skills && skills.map(skill => (<p className='h4 py-1'>{skill.skill}</p>))}
               <div className="d-flex gap-5 justify-content-center  m-2">
            <input type='text' className='rounded-1 p-1' placeholder='New Skill' value={newskill} onChange={(event) => setNewSkill(event.target.value)}></input>
            <button onClick={handleSkillBtn} className='btn btn-primary'>Add Skill</button>
          </div>
            </div>
            </div>
            
            <div className='container col-6 '>
            <div className='card  m-3 p-3' >
                <p className='h2 bg-info rounded-pill m-3 p-2'>Available Designations</p>
                {designations && designations.map(designation => (<p className='h4 py-1'>{designation.designation}</p>))}
               <div className="d-flex gap-5 justify-content-center  m-2">
            <input type='text' className='rounded-1 p-1' placeholder='New Skill' value={newDesignation} onChange={(event) => setNewDesignation(event.target.value)}></input>
            <button onClick={handleDesBtn} className='btn btn-primary'>Add Designation</button>
          </div>
            </div>
            </div>
        </div>
    )
    }

    export default About_us