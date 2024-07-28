import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { MdOutlineDelete } from "react-icons/md";
import urls from '../../Api_Urls';
const ShowSkills = ({ handleDeleteSkill, handleAddSkill, handleSaveSkills, skills, setSkills, fetchSkills, isEditing, setIsEditing }) => {
    const { token,is_user } = useSelector((state) => state.auth);
    const [skillOptions, setSkillOptions] = useState([]);
    const [isAccordionOpen, setIsAccordionOpen] = useState(false);
    useEffect(() => {
        fetchSkillOptions();
    },[])
    const expLevel = {
        BG: 'Beginner',
        IN: 'Intermediate',
        EX: 'Expert',
    };

    const handleEditSkill = (index, event) => {
        const { name, value, id } = event.target;
        const edited = [...skills];
        if (name === "skill") {
            let id = '';
            if (event.target.selectedOptions) {
                id = event.target.selectedOptions[0].getAttribute('id');
            }
            edited[index].skill_info.skill = value;
            edited[index].skill_info.id = id;
            edited[index].skill = id
        } else {
            edited[index].expertiseLevel = value;
            edited[index].expertise_level = expLevel[value];
        }
        setSkills(edited);
    };

    const fetchSkillOptions = async () => {
        if (token) {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                },
            };

            try {
                const response = await axios.get(urls.get_skills, config);
                setSkillOptions(response.data);
            } catch (err) {
                alert(`Error in fetching skills: ${err}`);
            }
        }
    };

    const toggleAccordion = () => {
        !isAccordionOpen && fetchSkills();
        setIsAccordionOpen(!isAccordionOpen);
        setIsEditing(false)
    };

    return (
        <div className="accordion accordion-flush col-8" id="accordionFlushExample">
            <div className="accordion-item">
                <h2 className="accordion-header" id="flush-headingOne">
                    <button
                        className={`accordion-button ${isAccordionOpen ? '' : 'collapsed'}`}
                        type="button"
                        onClick={toggleAccordion}
                        aria-expanded={isAccordionOpen}
                        aria-controls="flush-collapseOne"
                    >
                        Skills
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
                            <tbody>
                                {skills.map((skill, index) => (
                                    <tr key={index} className='text-center'>
                                        <td >
                                            {isEditing ? (
                                                skill.id ? (
                                                    skill.skill_info.skill
                                                ) : (
                                                    <select
                                                        id='sk'
                                                        name='skill'
                                                        value={skill.skill_info.skill || ""}
                                                        onChange={(e) => handleEditSkill(index, e)}
                                
                                                    >
                                                         <option value="" disabled>Select Skill</option>
                                                        {skillOptions.map((sk) => <>
                                                            <option key={index} value={sk.skill} id={sk.id} name="skill">
                                                                {sk.skill}
                                                            </option>
                                                        </>
                                                        )}
                                                    </select>
                                                )
                                            ) : (
                                                skill.skill_info.skill
                                            )}
                                        </td>
                                        <td>
                                            {isEditing ? (
                                                <select
                                                    name='expertiseLevel'
                                                    value={skill.expertiseLevel}
                                                    onChange={(e) => handleEditSkill(index, e)}
                                                >
                                                    <option value="BG">Beginner</option>
                                                    <option value="IN">Intermediate</option>
                                                    <option value="EX">Expert</option>
                                                </select>
                                            ) : (
                                                skill.expertise_level
                                            )}
                                        </td>
                                        <td>
                                            {isEditing && (
                                                <button className='btn btn-danger p-1 rounded-circle' onClick={() => handleDeleteSkill(index)} ><MdOutlineDelete /></button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {isEditing ? (
                            <div className="d-flex justify-content-between">
                                <button type="button" className='bg-primary rounded-pill p-0 px-3' onClick={handleAddSkill}>
                                    Add
                                </button>
                                <button type="button" className='bg-success rounded-pill px-3' onClick={handleSaveSkills}>
                                    Save
                                </button>
                            </div>  
                        ) : (
                            <>
                             {!is_user &&  <button type="button" className=' rounded-pill px-4' onClick={() => setIsEditing(true)}>
                                Edit
                            </button>}
                            </>
                          

                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ShowSkills