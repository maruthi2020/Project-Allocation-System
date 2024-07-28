import React, { useEffect, useState } from 'react'
import urls from '../../../Api_Urls';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Add_Employee = () => {
  const { token } = useSelector((state) => state.auth);
  const [designations,setDesignations] = useState([])
  const navigate=useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    date_joined: '',
    contact_address: '',
    designation: '',
    blood_group: '',
    phone_number: '',
    gender: '',
    password: '',
  });
  const [errors, setErrors] = useState({}); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' }); 
  };

  const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const validateRequired = (value) => value.trim() !== ''; 

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = {}; 
    let isValid = true;

    if (!validateEmail(formData.email)) {
      validationErrors.email = 'Invalid email address';
      isValid = false;
    }

    ['username', 'first_name', 'last_name', 'date_joined', 'designation', 'gender', 'password'].forEach(field => {
      if (!validateRequired(formData[field])) {
        validationErrors[field] = 'This field is required';
        isValid = false;
      }
    });

    setErrors(validationErrors); 

    if (isValid) {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      try {
        const res = await axios.post(urls.get_all_emp, formData, config);
        if (res) {
          navigate("/emps");
        }
      } catch (err) {
        alert(`Error adding employee: ${err}`);
      }
    }
  };


 useEffect(() => {
  async function fetchdesignations() {
    if (token) {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      };

      try {
        const res = await axios.get(urls.get_deigsnations, config);
        setDesignations(res.data)
      } catch (err) {
        alert(`Error msg in fetching projects:${err}`);
      }
    }
  }
  fetchdesignations()
 },[])
  return (
    <div class="container mt-4">
    <div class="row justify-content-center">
      <div class="col-lg-8">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Employee Registration</h5>
            <form id="registrationForm">
            {errors.username && <div className="text-danger">{errors.username}</div>}
              <div class="mb-3 row">
                <label for="usernameInput" class="col-sm-4 col-form-label">Username</label>
                <div class="col-sm-8">
                  <input  onChange={handleChange}  type="text" class="form-control" id="usernameInput" name="username" required/>
                </div>
              </div>
              {errors.first_name && <div className="text-danger">{errors.first_name}</div>}
              <div class="mb-3 row">
                <label for="firstNameInput" class="col-sm-4 col-form-label">First Name</label>
               
                <div class="col-sm-8">
                  <input  onChange={handleChange}  type="text" class="form-control" id="firstNameInput" name="first_name" required/>
                </div>
              </div>
              {errors.last_name && <div className="text-danger">{errors.last_name}</div>}
              <div class="mb-3 row">
                <label for="lastNameInput" class="col-sm-4 col-form-label">Last Name</label>
               
                <div class="col-sm-8">
                  <input  onChange={handleChange}  type="text" class="form-control" id="lastNameInput" name="last_name" required/>
                </div>
              </div>

              {errors.email && <div className="text-danger">{errors.email}</div>}
              <div class="mb-3 row">
                <label for="emailInput" class="col-sm-4 col-form-label">Email address</label>
                <div class="col-sm-8">
                  <input  onChange={handleChange}  type="email" class="form-control" id="emailInput" name="email" required/>
                </div>
              </div>

              {errors.date_joined && <div className="text-danger">{errors.date_joined}</div>}
              <div class="mb-3 row">
                <label for="dateJoinedInput" class="col-sm-4 col-form-label">Date Joined</label>
                <div class="col-sm-8">
                  <input  onChange={handleChange}  type="date" class="form-control" id="dateJoinedInput" name="date_joined" required/>
                </div>
              </div>

              <div class="mb-3 row">
                <label for="addressInput" class="col-sm-4 col-form-label">Contact Address</label>
                <div class="col-sm-8">
                  <input  onChange={handleChange}  type="text" class="form-control" id="addressInput" name="contact_address"/>
                </div>
              </div>

              {errors.designation && <div className="text-danger">{errors.designation}</div>}
              <div class="mb-3 row">
                <label for="designationInput" class="col-sm-4 col-form-label">Designation</label>
                <div class="col-sm-8">
                <select  onChange={handleChange}  class="form-select" id="designationInput" name="designation"  required>
                  <option value="">Select Designation</option>
                  {
                    designations.map(designation => <option value={designation.id}>{designation.designation}</option> )
                  }
                 
                </select>
                </div>
              </div>
              <div class="mb-3 row">
                <label for="bloodGroupInput" class="col-sm-4 col-form-label">Blood Group</label>
                <div class="col-sm-8">
                  <input  onChange={handleChange}  type="text" class="form-control" id="bloodGroupInput" name="blood_group"/>
                </div>
              </div>

              {errors.first_name && <div className="text-danger">{errors.first_name}</div>}
              <div class="mb-3 row">
                <label for="phoneInput" class="col-sm-4 col-form-label">Phone Number</label>
                <div class="col-sm-8">
                  <input  onChange={handleChange}  type="tel" class="form-control" id="phoneInput" name="phone_number" required/>
                </div>
              </div>


              
              {errors.gender && <div className="text-danger">{errors.gender}</div>}
              <div class="mb-3 row">
              <label class="col-sm-4 col-form-label">Gender</label>
              <div class="col-sm-8">
                <select  onChange={handleChange}  class="form-select" id="genderInput" name="gender" required>
                  <option value="">Select Gender</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                </select>
              </div>
            </div>

            
            {errors.password && <div className="text-danger">{errors.password}</div>}
              <div class="mb-3 row">
                <label for="passwordInput" class="col-sm-4 col-form-label">Password</label>
                <div class="col-sm-8">
                  <input  onChange={handleChange}  type="password" class="form-control" id="passwordInput" name="password" required/>
                </div>
              </div>
              <button type="submit" class="btn btn-primary" onClick={handleSubmit}>Submit</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
  

  )
}

export default Add_Employee