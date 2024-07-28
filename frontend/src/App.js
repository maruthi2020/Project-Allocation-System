import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate, } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import Layout from './components/Layout';



import ViewAllEmployees from './components//Home/Admin_view/Employees/ViewAllEmployees';
import Admin_Project_view from './components/Home/Admin_view/Projects/Admin_Project_view';
import AddProject from './components/Home/Admin_view/Projects/AddProject';
import Add_Employee from './components/Home/Admin_view/Employees/Add_Employee';
import About_us from './components/Home/Admin_view/About us/About_us';


const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path='' element={<Navigate to={"/login"}/>}/>
            <Route exact path='/login' element={<Login />} />
            <Route exact path='/home' element={<Home />} />
            <Route exact path='/emps' element={<ViewAllEmployees/>} />
            <Route exact path="/proj" element={<Admin_Project_view/>}/>
            <Route exact path='/add_proj' element={<AddProject/>}/>
            <Route exact path='/add_emp' element={<Add_Employee/>}/>
            <Route exact path='/about' element={<About_us/>}/>
            <Route path='*' element={<Home />}/>
          </Routes>
        </Layout>
      </BrowserRouter>
    </div>
  );
}

export default App;
