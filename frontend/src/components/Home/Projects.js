import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import urls from '../Api_Urls';
import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Table, Button } from 'react-bootstrap'; 

const Projects = () => {
    const { token, user,is_user } = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(false);
    const [projs,setProjs]=useState([])
    const navigate = useNavigate();
    useEffect(()=>{
        async function fetchprojects() {
            if (token) {
              const config = {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                  Accept: 'application/json',
                },
              };
      
              try {
                const res = await axios.get(urls.get_user_projs, config);
                setProjs(res.data)
              } catch (err) {
                alert(`Error msg in fetching projects:${err}`);
              }
            }
            setLoading(false);
          }
          fetchprojects()
    },[])

    const projectHandler=(key) => {
     navigate('/proj', { state: {project : {...key}} });
    //    !is_user &&
    }

    const projectaddhandler=()=>{
      navigate("/add_proj")
    }

    if (loading) {
        return <p>Loading...</p>;
      }
      if (token == null) return <Navigate to="/login" />;
      if(user){
        if(projs.length ==0){
            return <>
            <h1>Your not assigned to any project ...</h1>
             {!is_user  && <p className='btn d-flex justify-content-end h1 text-info' onClick={projectaddhandler}>Add project</p>}
            </>
        }
        return (
          <div>
      <h2 className='text-dark bg-info rounded-pill p-2'><i>Projects</i></h2>
      {!is_user && <div className='btn d-flex justify-content-end ' onClick={projectaddhandler}>
        <div className='h5 text-info'>Add project</div></div>}
      <div className="container">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Title</th>
              <th>Duration</th>
              <th>Project Lead</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {projs.map(project => (
              <tr key={project.id} onClick={() => projectHandler(project)}>
                <td>{project.title}</td>
                <td>{project.starting_date} to {project.deadline}</td>
                <td>{project.project_lead ? project.project_lead.username : 'N/A'}</td>
                <td>{project.description}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
          )
      }
  
}

export default Projects;
