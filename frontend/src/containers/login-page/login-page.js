import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import './login-page.sass';
import Header from '../../components/header/header';
import { Link, useNavigate } from 'react-router-dom';
import { decodeToken } from 'react-jwt';

const LoginRegisterSwitch = () => {
  const [isLoginForm, setisLoginForm] = useState(false);
  const toggleForm = () => {
    setisLoginForm(!isLoginForm);
  };

  return (
    <>
      <Header page="login" setisLoginForm={setisLoginForm} />

      <div className="login-register-switch">
        <div className="login-register-switch__wrapper">
          <div className="login-register-switch-button__wrapper">
            <button
              className={`login-register-switch-button__item ${isLoginForm ? 'active' : ''}`}
              onClick={toggleForm}
            >
              Реєстрація
            </button>
            <button
              className={`login-register-switch-button__item ${isLoginForm ? '' : 'active'}`}
              onClick={toggleForm}
            >
              Вхід
            </button>
          </div>

          {isLoginForm ? <LoginForm /> : <RegisterForm />}
        </div>
      </div>
    </>
  );
};

const LoginForm = () => {
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();

    const { email, password } = event.target.elements;
    
    try {
      const response = await axios.post('http://localhost:3002/auth/login', {
        email: email.value,
        password: password.value,
      });

      // Read cookies using js-cookie
    //   const { token } = response.data; // Получите токен из ответа сервера

    // // // Установите токен в куки с помощью js-cookie
    //   Cookies.set('access_token', token, { expires: 1 });

      event.target.reset();

      decodeToken(Cookies.get('access_token')).isAdmin ? navigate('/admin') : navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <h2>Вхід</h2>
      <label htmlFor="login-email">
        Пошта:
        <input type="email" id="login-email" name="email" required />
      </label>
      <label htmlFor="login-password">
        Пароль:
        <input type="password" id="login-password" name="password" required />
      </label>
      <button type="submit">Увійти</button>
    </form>
  );
};

const RegisterForm = () => {
  const handleSubmit = async (event) => {
    event.preventDefault();

    const { name, email, password, phone } = event.target.elements;

    try {
      const response = await axios.post('http://localhost:3002/auth/register', {
        name: name.value,
        email: email.value,
        password: password.value,
        phone: phone.value,
      });

      const data = response.data;
      console.log(data);
      event.target.reset();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="register-form">
      <h2>Реєстрація</h2>
      <label htmlFor="register-name">
        Ім'я:
        <input type="text" id="register-name" name="name" required />
      </label>
      <label htmlFor="register-email">
        Пошта:
        <input type="email" id="register-email" name="email" required />
      </label>
      <label htmlFor="register-password">
        Пароль:
        <input type="password" id="register-password" name="password" required />
      </label>
      <label htmlFor="register-phone">
        Телефон:
        <input type="tel" id="register-phone" name="phone" required />
      </label>
      <button type="submit">Зареєструватися</button>
    </form>
  );
};

export default LoginRegisterSwitch;
