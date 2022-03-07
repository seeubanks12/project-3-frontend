import React from "react";
import { get, post } from "../http/service";
import MainNav from "./MainNav";
import { useNavigate } from "react-router-dom";

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

  // const checkToken = () => {
  //   let thing = localStorage.getItem("token");
  //   console.log("This was stored in our localStorage", thing);
  // };

  // const checkIfLoggedIn = (e) => {
  //   e.preventDefault();
  //   get("/api/auth/loggedIn")
  //     .then((results) => {
  //       console.log("Are you logged in?", results.data);
  //     })
  //     .catch((err) => {
  //       console.error(err.message);
  //     });
  // };

  //   const logout = () => {
  //     localStorage.removeItem("token");
  //     console.log("You have logged out");
  //   };

  return (
    <div>
      <MainNav />
      <form onSubmit={signupUser} style={{paddingTop: 100}}>
        <input
          value={username}
          placeholder="username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          value={email}
          placeholder="email address"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          value={password}
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Signup</button>
      </form>
      {/* <button onClick={checkIfLoggedIn}>See if you are logged in</button>
      <button onClick={checkToken}>check if token is stored</button> */}
      {/* <button onClick={logout}>Log Out</button> */}
    </div>
  );
};

export default Signup;
