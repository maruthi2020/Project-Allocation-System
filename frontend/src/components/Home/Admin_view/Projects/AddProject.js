import React, { useEffect, useState } from 'react';
import urls from '../../../Api_Urls';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddProject = () => {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    starting_date: '',
    deadline: '',
    lead: '', // Add lead field if needed
  });
  const [errors, setErrors] = useState({}); // State to store validation errors

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.name === 'deadline' ? e.target.value : e.target.value.trim() }); // Trim whitespaces for title and description
    setErrors({ ...errors, [e.target.name]: '' }); // Clear error on change
  };

  const validate = () => {
    const validationErrors = {};
    if (!formData.title) {
      validationErrors.title = 'Title is required';
    }
    if (!formData.description) {
      validationErrors.description = 'Description is required';
    }
    if (!formData.starting_date) {
      validationErrors.starting_date = 'Starting date is required';
    } else if (new Date(formData.starting_date) > new Date()) {
      validationErrors.starting_date = 'Starting date cannot be in the future';
    }
    if (!formData.deadline) {
      validationErrors.deadline = 'Deadline is required';
    } else if (new Date(formData.deadline) < new Date(formData.starting_date)) {
      validationErrors.deadline = 'Deadline cannot be before starting date';
    }
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0; 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return; 

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const res = await axios.post(urls.create_proj, formData, config);
      console.log(res);
      if (res) {
        navigate("/home");
      }
    } catch (err) {
      alert(`Error msg in creating projects:${err}`);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Create New Project</h5>
              <form id="projectForm" onSubmit={handleSubmit}>
                <div className="mb-3 row">
                  <label htmlFor="titleInput" className="col-sm-4 col-form-label">
                    Title
                  </label>
                  <div className="col-sm-8">
                    <input
                      onChange={handleChange}
                      type="text"
                      className="form-control"
                      id="titleInput"
                      name="title"
                      required
                    />
                    {errors.title && <div className="text-danger">{errors.title}</div>}
                  </div>
                </div>
                <div className="mb-3 row">
                  <label htmlFor="descriptionInput" className="col-sm-4 col-form-label">
                    Description
                  </label>
                  <div className="col-sm-8">
                    <textarea
                      onChange={handleChange}
                      className="form-control"
                      id="descriptionInput"
                      rows={3}
                      name="description"
                      required
                    ></textarea>
                    {errors.description && (
                      <div className="text-danger">{errors.description}</div>
                    )}
                  </div>
                </div>
                <div className="mb-3 row">
                  <label htmlFor="startDateInput" className="col-sm-4 col-form-label">
                    Starting Date
                  </label>
                  <div className="col-sm-8">
                    <input onChange={handleChange} type="date" className="form-control" id="startDateInput" name="starting_date" required />
                  
                  {errors.starting_date && (
                      <div className="text-danger">{errors.starting_date}</div>
                    )}
                    </div>
                </div>

                <div className="mb-3 row">
                  <label htmlFor="deadlineInput" className="col-sm-4 col-form-label">Deadline</label>
                  <div className="col-sm-8">
                    <input onChange={handleChange} type="date" className="form-control" id="deadlineInput" name="deadline" min={formData.starting_date} required />
                    {errors.deadline && (
                      <div className="text-danger">{errors.deadline}</div>
                    )}
                  </div>
                </div>
                <button type="submit" className="btn btn-primary" onClick={handleSubmit}>Submit</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProject;
