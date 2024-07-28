import axios from 'axios';
import React, { useState } from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import urls from './Api_Urls';
import { useSelector } from 'react-redux';
import { BsBell } from 'react-icons/bs';
const NotificationComponent = () => {
    const { token, user } = useSelector((state) => state.auth);
  const [notifications, setNotifications] = useState([]);

  const handleNotificationClick = async () => {
    const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      };

    const res=await axios.get(urls.get_notifications,config)
    setNotifications(res.data);
  };

  return (
    <div>
     <DropdownButton
      title={<BsBell />} 
      onClick={handleNotificationClick}
    >
      {notifications.length > 0 ? (
        notifications.map((notification, index) => (
          <Dropdown.Item key={index}>{notification.message}</Dropdown.Item>
        ))
      ) : (
        <Dropdown.Item>No new notifications</Dropdown.Item>
      )}
    </DropdownButton>
    </div>

  );
};

export default NotificationComponent;
