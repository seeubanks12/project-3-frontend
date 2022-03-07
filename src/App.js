import "./App.css";
import React from "react";
// import axios from "axios";
import GoogleMap from "./components/GoogleMap";
import { Routes, Route } from "react-router-dom";
// import UserPins from "./components/UserPins";
// import UserTrips from "./components/UserTrips";
// import PlanTrip from "./components/PlanTrip";
import Login from "./components/Login";
import Home from "./components/Home";
import Signup from "./components/Signup";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile-page" element={<GoogleMap />} />
        {/* <Route path="/pins" element={<UserPins />} />
        <Route path="/trips" element={<UserTrips />} />
        <Route path="/plan-trip" element={<PlanTrip />} /> */}
      </Routes>
    </div>
  );
}

export default App;
