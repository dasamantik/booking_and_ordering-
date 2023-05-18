import './header.sass';
import logo from '../../img/logo.png'
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';

function Header(props){
    const {page} = props;
    const logReg = page!=='login';
    const token = Cookies.get('access_token');
    const handleClearCookie = async () => {
        const axiosInstance = axios.create({
            withCredentials: true,
          });
      
          const options = {
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Credentials': 'true',
            },
          };
      
          try {
            await axiosInstance.get('http://localhost:3002/logout', options);
            console.log('Logout successful');
            Cookies.remove('token');
          } catch (error) {
            console.log(error);
          }
    }
     const headButtons = () => {
        const token = Cookies.get('access_token');
        if(token){
            return (<>
                <Link style={{all:'unset', cursor: 'pointer'}} to='/login' onClick={handleClearCookie}>
                    Logout
                </Link>
            </>);
        }
        if((!token) && (!logReg)) {
            return (
            <>
                <Link to='/login'><div className="log-reg__item">Register</div></Link>
                <Link to='/login'><div className="log-reg__item">Log In</div></Link>
            </>);
        } 
    }
    const HeaderRigth = () =>{
        
        return(
            <div className="log-reg__wrapper">
                <headButtons />
            </div>
        )
    }
    return(
        <header>
            <div className="logo__wrapper">
                <img src={logo} alt="logo"/>
            </div>
            <HeaderRigth />
        </header>
    );
}

export default Header;