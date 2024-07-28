import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import axios from 'axios';

import urls from '../../../Api_Urls';
import FemaleLogo from '../../../../images/Employee_female.png';
import MaleLogo from '../../../../images/Employee_male.png';
import ShowEmployeeSkills from './showEmploeeSkills';

export const Employee_Card = ({ user }) => {
    const { token ,is_user} = useSelector((state) => state.auth);
    return (
        <div className="card p-2 mt-3 mx-2 border">
              {console.log(is_user,"empcard")}
            <div className="mx-auto text-center  p-2 " >
                <img id="profile_pic" src={user.emp_gender == "Male" ? MaleLogo : FemaleLogo} width="45%" />
                <div className='d-flex flex-column justify-content-center'>
                    <p>Name : <span className="pt-3" > {`${user.first_name} ${user.last_name}`}</span></p>
                    <p id="designation">Designation :  {user.emp_designation ? user.emp_designation.designation : null}</p>
                    <p>Email : <span className="pt-3" > {user.email} </span></p>
                </div>
            </div>
            <div className="d-flex justify-content-center">
                <ShowEmployeeSkills user={user}/>
            </div>
        </div>
    )
}

export default Employee_Card;
