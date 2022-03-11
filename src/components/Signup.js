import React from "react";
import { get, post } from "../http/service";
import MainNav from "./MainNav";
import { useNavigate } from "react-router-dom";
import logo from "../assets/pete-logo.png";

const Signup = () => {
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const navigate = useNavigate();

  const signupUser = (e) => {
    e.preventDefault();
    post("/api/auth/signup", {
      username,
      email,
      password,
    })
      .then((results) => {
        console.log("Thanks for signing up!", results.data);

        localStorage.setItem("token", results.data);
        navigate("/profile-page");
        // let thing = localStorage.getItem("token");
        // console.log("This was stored in our localStorage", thing);
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
          <div className="text-center mt-4 name"> Signup </div>
          <form
            className="p-3 mt-3"
            onSubmit={signupUser}
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
                value={email}
                placeholder="email address"
                onChange={(e) => setEmail(e.target.value)}
              />{" "}
            </div>{" "}
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
              Signup!
            </button>
          </form>
          <div className="text-center fs-6"> </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
