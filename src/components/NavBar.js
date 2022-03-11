import { Link } from "react-router-dom";
import logo from "../assets/pete-logo.png";
import { useNavigate } from "react-router-dom";


const NavBar = () => {
  const navigate = useNavigate();

const logout = () => {
  localStorage.removeItem("token");
  navigate("/"); 
};

  return (
    <div className="navbar navbar-expand-sm bg-light navbar-light pb-100">
      <nav className="container">
        <Link to="/profile-page" className="navbar-brand">
          <img
            src={logo}
            alt="logo"
            className="img-fluid d-none d-sm-block"
            id="pete-logo"
          />
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navmenu"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </Link>
        <div className="collapse navbar-collapse" id="navmenu">
          <ul className="navbar-nav ms-auto ">
            <li className="nav-item ms-4">
              <Link to="/view-all">
                <p>My Pins</p>
              </Link>
            </li>
            <li className="nav-item ms-4">
              <Link to="/view-calendar">
                <p>Trips</p>
              </Link>
            </li>
            <li className="nav-item ms-4">
              <Link to="/edit-user">
                <p>Settings</p>
              </Link>
            </li>
            <li className="nav-item ms-4">
              <button onClick={logout}>Log Out</button>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
