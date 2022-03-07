import { Link } from "react-router-dom";
import logo from "../assets/pete-logo.png";

const MainNav = () => {
  return (
    <div className="navbar navbar-expand-sm bg-light navbar-light py-1 fixed-top">
      <nav className="container">
        <Link to="/" className="navbar-brand">
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
        {/* <div className="collapse navbar-collapse" id="navmenu">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item"> */}
              <Link to="/login">
                <p>Login</p>
              </Link>
            {/* </li> */}
            {/* <li className="nav-item"> */}
              <Link to="/signup">
                <p>Signup</p>
              </Link>
            {/* </li>
          </ul>
        </div> */}
      </nav>
    </div>
  );
};

export default MainNav;
