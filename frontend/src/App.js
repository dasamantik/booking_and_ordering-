import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import LoginRegisterSwitch from './containers/login-page/login-page';
import MainPage from './containers/main-page/main-page';
import RestPage from './containers/rest-page/rest-page';
import 'bootstrap/dist/css/bootstrap.min.css';
import AdminPage from './containers/admin-page/admin-page';
import { decodeToken } from 'react-jwt';
import Cookies from 'js-cookie';

function App() {

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path="/" element={<MainPage />} />
          <Route exact path="/restaurant/:id" element={<RestPage />} />
          <Route path='/login' element={<LoginRegisterSwitch />} />
          <Route path='/admin' element={decodeToken(Cookies.get('access_token'))?.isAdmin && <AdminPage />} />
        </Routes>
    </Router>
    </div>
  );
}

export default App;
