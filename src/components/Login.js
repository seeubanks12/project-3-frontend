import React from "react";
import { get, post } from "../http/service";
import MainNav from "./MainNav";
import { useNavigate } from "react-router-dom";
import logo from "../assets/pete-logo.png";

const Login = () => {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const navigate = useNavigate();

  const loginUser = (e) => {
    e.preventDefault();
    post("/api/auth/login", {
      username,
      password,
    })
      .then((results) => {
        console.log("You are logged in!!!", results.data);

        localStorage.setItem("token", results.data);
        navigate("/profile-page");
      })
      .catch((err) => {
        console.error(err.message);
      });
  };

  return (
    <div>
      <MainNav />
      <div className="bg-danger" style={{ padding: "70px" }}>
        <div className="wrapper">
          <div className="logo">
            {" "}
            <img
              src={logo}
              alt="logo"
              className="img-fluid d-none d-sm-block"
              id="pete-logo"
            />{" "}
          </div>
          <div className="text-center mt-4 name"> Login </div>
          <form
            className="p-3 mt-3"
            onSubmit={loginUser}
            style={{ paddingTop: 100 }}
          >
            <div className="form-field d-flex align-items-center">
              {" "}
              <span className="far fa-user"></span>{" "}
              <input
                value={username}
                placeholder="username"
                onChange={(e) => setUsername(e.target.value)}
              />{" "}
            </div>
            <div className="form-field d-flex align-items-center">
              {" "}
              <span className="fas fa-key"></span>{" "}
              <input
                value={password}
                type="password"
                placeholder="password"
                onChange={(e) => setPassword(e.target.value)}
              />{" "}
            </div>{" "}
            <button className="btn mt-3" type="submit">
              Login
            </button>
          </form>
          <div className="text-center fs-6"> </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
