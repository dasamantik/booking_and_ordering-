import './header.sass';
import logo from '../../img/logo.png'
import { Link } from 'react-router-dom';
function Header(props){
    const {page} = props;
    const logReg = page!=='login';
    return(
        <header>
            <div className="logo__wrapper">
                <img src={logo} alt="logo"/>
            </div>
            {logReg && <div className="log-reg__wrapper">
                <Link to='/login'><div className="log-reg__item">Register</div></Link>
                <Link to='/login'><div className="log-reg__item">Log In</div></Link>
            </div>}
        </header>
    );
}

export default Header;