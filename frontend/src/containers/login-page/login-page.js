import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import './login-page.sass';
import Header from '../../components/header/header';

const LoginRegisterSwitch = () => {
  const [isLogin, setIsLogin] = useState(true);
  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <>
      <Header page="login" setIsLogin={setIsLogin} />

      <div className="login-register-switch">
        <div className="login-register-switch__wrapper">
          <div className="login-register-switch-button__wrapper">
            <button
              className={`login-register-switch-button__item ${isLogin ? 'active' : ''}`}
              onClick={toggleForm}
            >
              Реєстрація
            </button>
            <button
              className={`login-register-switch-button__item ${isLogin ? '' : 'active'}`}
              onClick={toggleForm}
            >
              Вхід
            </button>
          </div>

          {isLogin ? <LoginForm /> : <RegisterForm />}
        </div>
      </div>
    </>
  );
};

const LoginForm = () => {
  const handleSubmit = async (event) => {
    event.preventDefault();

    const { email, password } = event.target.elements;

    try {
      const response = await axios.post('http://localhost:3002/auth/login', {
        email: email.value,
        password: password.value,
      });

      const data = response.data;
      console.log(data);

      
      const token = Cookies.get('token');
      console.log(token);

      event.target.reset();
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

      // Read cookies using js-cookie
      const token = Cookies.get('token');
      console.log(token);

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
