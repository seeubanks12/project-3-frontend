import { Link } from "react-router-dom";
import logo from "../assets/pete-logo.png";

const logout = () => {
  localStorage.removeItem("token");
  console.log("You have logged out");
};

const NavBar = () => {
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
        <div className="collapse navbar-collapse" id="navmenu">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link to="/pins">
                <p>My Pins</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/trips">
                <p>My Trips</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/plan-trip">
                <p>Plan a Trip</p>
              </Link>
            </li>
            <li className="nav-item">
              <button onClick={logout}>Log Out</button>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
