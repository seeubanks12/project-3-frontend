import "./App.css";
import React from "react";
import Modal from "react-modal";
// import axios from "axios";
import GoogleMap from "./components/GoogleMap";
import { Routes, Route } from "react-router-dom";
// import UserPins from "./components/UserPins";
import Calendar from "./components/Calendar";
import TripCard from "./components/TripCard";
import Login from "./components/Login";
import Home from "./components/Home";
import Signup from "./components/Signup";
import EditUser from "./components/EditUser";

Modal.setAppElement("#root");

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile-page" element={<GoogleMap />} />
        {/* <Route path="/pins" element={<UserPins />} /> */}
        <Route path="/view-calendar" element={<Calendar />} />
        <Route path="/plan-trip" element={<TripCard />} />
        <Route path="/edit-user" element={<EditUser />} />
      </Routes>
    </div>
  );
}

export default App;
