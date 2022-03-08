import React from "react";
import { get, post } from "../http/service";
import NavBar from "./NavBar";
import { useNavigate } from "react-router-dom";

const EditUser = () => {
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");

  const navigate = useNavigate();

  React.useEffect(() => {
    get("/api/user/edit-user").then((foundUser) => {
      setUsername(foundUser.data.username);
      setEmail(foundUser.data.email);
    });
  }, []);

  const updateUser = (e) => {
    e.preventDefault();
    post(
      "/api/user/edit-user",
      {
        username,
        email,
      },
      { new: false }
    ).then((foundUser) => {
      console.log("We found this user", foundUser.data);
      localStorage.setItem("user", foundUser.data);
      navigate("/profile-page");
    });
  };

  const deleteUser = (e) => {
    e.preventDefault();
    post("/api/user/delete")
      .then(() => {
        localStorage.clear();
        navigate("/");
      })
      .catch((err) => {
        console.error(err.message);
      });
  };

  return (
    <div>
      <NavBar />
      <h2 style={{ paddingTop: 100 }}>Update Information</h2>
      <form onSubmit={updateUser}>
        <input value={username} onChange={(e) => setUsername(e.target.value)} />
        <input value={email} onChange={(e) => setEmail(e.target.value)} />
        <button type="submit">Update Information</button>
      </form>
      <button onClick={deleteUser}>Delete Account</button>
    </div>
  );
};

export default EditUser;
