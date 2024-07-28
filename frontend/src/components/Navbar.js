import React, {useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { logoutUser } from '../redux/reducers/authSlice';
import Logo from '../images/beehyvlogo.png';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { BsBell } from 'react-icons/bs';
import axios from 'axios';
import urls from './Api_Urls';
import { Badge } from 'react-bootstrap';
import "../Css/Navbar.css"

const NavbarComponent = () => {
  const dispatch = useDispatch();
  const { token,username,is_user } = useSelector(state => state.auth);
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0)
  const [isSeen, setIsSeen] = useState(false)
  const fetchNotifications = async () => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    };

    const res = await axios.get(urls.get_notifications, config)
    // setNotificationCount(res.data.length)
    // setNotifications(res.data);
  }

  useEffect(() => {
    token && fetchNotifications()
  }, [])

  const postNotificationsAsSeen = async () => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    };
    try {
      const res = await axios.put(urls.get_notifications, notifications, config)
    }
    catch {
      alert("error in updating notifications")
    }
    setNotifications([])
    setNotificationCount(0)
  }


  const handleNotificationClick = async () => {
    fetchNotifications();
    if (isSeen) {
      postNotificationsAsSeen()
    }
    setIsSeen(!isSeen);
  };
  const submitHandler = () => {
    dispatch(logoutUser());
  };
  {console.log("cheking")}
  return (
    <>
      {token == null ? (
        <nav className="navbar navbar-expand-lg" style={{
          background: 'rgb(44,107,122)',
          background: 'linear-gradient(51deg, rgba(44,107,122,1) 0%, rgba(9,121,61,1) 0%, rgba(81,143,7,1) 0%, rgba(6,161,129,1) 19%, rgba(0,236,255,1) 100%)',
          color: 'white',
        }}>
          <marquee className="text-dark opacity-75 h4 p-0 m-0 " style={{ margin: 0 ,height:'4.8vh'}}>
            <i>Welcome to Beehyv Project Allocation site</i>
          </marquee>
        </nav>
      ) : (


        <Navbar expand="lg" className="bg-body-tertiary d-flex justify-content-between align-items-center">
          <Container fluid>
            <Navbar.Brand as={Link} to="/home">
              <img src={Logo} alt="Logo" className="logo-image mx-3" style={{ maxWidth: '100px', minWidth: '25px' }} />
            </Navbar.Brand>
            {!is_user &&<><Nav.Link  as={Link} to="/emps" className="me-auto my-2 my-lg-0 nav-link-hover p-2">Employees</Nav.Link>
            <Nav.Link  as={Link} to="/about" className="me-auto my-2 my-lg-0 nav-link-hover p-2">About us</Nav.Link>
            </> }
            

            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Collapse id="navbarScroll">
              <Nav className="ms-auto align-items-center" navbarScroll>
                <NavDropdown
                  title={<><BsBell /><Badge bg="primary rounded-circle m-0 ">
                    {notificationCount != 0 && notificationCount}
                  </Badge></>}
                  onClick={handleNotificationClick}
                  id="navbarScrollingDropdown"
                  align="start"
                  className="dropdown-menu-left my-dropdown "

                >

                  {notifications.length > 0 ? (
                    notifications.map((notification, index) => (
                      <span key={index} className="dropdown-item-text">{notification.message}</span>
                    ))
                  ) : (
                    <span>No new notifications</span>
                  )}
                </NavDropdown>
                <div className="mx-3" dangerouslySetInnerHTML={{ __html: `Hello &#128075; ${username}` }}></div>
                <Nav.Link as={Link} to='/home' className="mx-3 nav-link-hover" onClick={submitHandler}>Log out</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      )}
    </>
  )
}


export default NavbarComponent;
