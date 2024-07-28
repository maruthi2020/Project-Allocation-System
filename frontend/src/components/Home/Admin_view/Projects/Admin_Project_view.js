import { useLocation, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import urls from '../../../Api_Urls';
import Get_suggested_Employees from './Get_suggested_Employees';
import Display_Employees_In_Project from './Display_Employees_In_Project';
import ShowSkills from './ShowProjectSkills';
import { fetchUser } from '../../../../redux/reducers/authSlice';
import Home from '../../../Home';
const Admin_Project_view = () => {
  const location = useLocation();
  const project = location?.state?.project || null;
  
  const { token,is_user,user} = useSelector((state) => state.auth);

  const [skillsHasChanges, setSkillsHasChanges] = useState(false);
  const [suggEmpHasChanges, setsuggEmpHasChanges] = useState(false);
 
  if (token == null) return <Navigate to="/login" />;
  return (
    <div>
      <h2>{project.title}</h2>
      <div className="container-fluid full-body">
        <div className="row justify-content-center">
          <div className="col-lg-3 col-md-5 col-sm-6 col-xs-12">
            <div className='card p-2 mt-3 mx-2 border'>
              <h2 className='bg-info rounded  '>Project Details</h2>
              <table className="table  table-borderless text-start">
                <tbody>
                  <tr>
                    <td><b>Title</b></td>
                    <td>: {project.title}</td>
                  </tr>
                  <tr>
                    <td><b>Description</b></td>
                    <td>: {project.description}</td>
                  </tr>
                  <tr>
                    <td><b>Start Date</b></td>
                    <td>: {project.starting_date}</td>
                  </tr>
                  <tr>
                    <td><b>Deadline</b></td>
                    <td>: {project.deadline}</td>
                  </tr>
                </tbody>
              </table>
              <ShowSkills skillsHasChanges={skillsHasChanges} setSkillsHasChanges={setSkillsHasChanges} project={project}/>
            </div>
          </div>
          <div className="col">
            <Display_Employees_In_Project user={user} project={project} skillsHasChanges={skillsHasChanges} suggEmpHasChanges={suggEmpHasChanges} setsuggEmpHasChanges={setsuggEmpHasChanges} />
            {!is_user && <Get_suggested_Employees project={project}  skillsHasChanges={skillsHasChanges} suggEmpHasChanges={suggEmpHasChanges} setsuggEmpHasChanges={setsuggEmpHasChanges} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin_Project_view;





              {/* <div className="accordion accordion-flush col-8" id="accordionFlushExample">
                <div className="accordion-item">
                  <h2 className="accordion-header" id="flush-headingOne">
                    <button
                      className={`accordion-button ${isAccordionOpen ? '' : 'collapsed'}`}
                      type="button"
                      onClick={toggleAccordion}
                      aria-expanded={isAccordionOpen}
                      aria-controls="flush-collapseOne"
                    >
                      Required skills
                    </button>
                  </h2>
                  <div
                    id="flush-collapseOne"
                    className={`accordion-collapse collapse ${isAccordionOpen ? 'show' : ''}`}
                    aria-labelledby="flush-headingOne"
                    data-bs-parent="#accordionFlushExample"
                  >
                    <div className="accordion-body">
                      <table className="table table-borderless small" ><tbody>
                        {skills && skills.map((skill, index) => (
                          <><tr key={skill.id}>
                            <td>{skill.skill_info.skill ? skill.skill_info.skill : (
                              <select
                              id='sk'
                                name='skill'
                                value={skill.skill_info.skill}
                                onChange={(e) => handleEditSkill(index, e)}
                              >
                                {skillOptions.map((sk) => <>
                                  <option key={index} value={sk.skill} id={sk.id} name="skill">
                                    {sk.skill}
                                  </option>
                                </>
                                )}
                              </select>
                            )} </td>
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
                          </tr></>
                        )
                        )}
                        
                      </tbody>
                      </table>
                      {isEditing ? (
                        <div className='d-flex justify-content-between'>
                          <button type="button" onClick={handleAddSkills}>
                            add skill
                          </button>
                          <button type="button" onClick={handleSaveSkills}>
                            Save
                          </button>
                        </div>
                      ) : (
                        <button type="button" onClick={() => setIsEditing(true)}>
                          Edit
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div> */}