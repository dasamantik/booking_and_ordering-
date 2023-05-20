import React, { useEffect } from 'react';
import './header.sass';
import logo from '../../img/logo.png';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';

function Header(props) {
  const { page } = props;
  const logReg = page !== 'login';
  const token = Cookies.get('access_token');

  const handleClearCookie = async () => {
    try {
      const token = Cookies.get('access_token');
  
      await axios.post('http://localhost:3002/auth/logout', {}, {
        headers: {
          Authorization: `${token}`,
        }
        });
      console.log('Logout successful');
      Cookies.remove('access_token');
      
    } catch (error) {
      console.log(error);
    }
  };
  const renderHeadButtons = () => {
 
    if (token && logReg) {
      return (
        <>
          <Link style={{ all: 'unset', cursor: 'pointer' }} to='/login' onClick={handleClearCookie}>
            Logout
          </Link>
        </>
      );
    }
    
    if (logReg && !token ) {
      return (
        <>
          <Link to="/login">
            <div className="log-reg__item">Register</div>
          </Link>
          <Link to="/login">
            <div className="log-reg__item">Log In</div>
          </Link>
        </>
      );
    }
    if(!logReg) {
        return(null);
    }
  };

  const HeaderRight = () => {
    return <div className="log-reg__wrapper">{renderHeadButtons()}</div>;
  };

  return (
    <header>
      <div className="logo__wrapper">
        <Link style={{ all: 'unset', cursor: 'pointer' }} to='/'><img src={logo} alt="logo" /></Link>
      </div>
      <HeaderRight />
    </header>
  );
}

export default Header;
