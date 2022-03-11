import React from "react";
import MainNav from "./MainNav";
import mainLogo from "../assets/main-pete.png";

const Home = () => {
  return (
    <div>
      <nav>
        <MainNav />
      </nav>
      <section className="bg-danger text-light text-center text-sm-start">
        <div className="container py-5 px-0">
          <div className="main-logo">
            <img
              src={mainLogo}
              alt="logo"
              className="float-right img-responsive"
              id="pete-logo"
              style={{width: "200px", height: "200px"}}
            />
          </div>
          <div
            className="d-sm-flex align-items-center justify-content-between"
            style={{ padding: "100px" }}
          >
            <div>
              <h1>Plan. Experience. Travel. Explore.</h1>
              <h3 className="text-info">Ready to get away?</h3>
              <br />
              <h4 className="about-text" style={{ lineHeight: "2em" }}>
                PETE can help you research destinations with GoogleMaps,
                <br />
                collaborate and create a plan with travel companions,
                <br />
                and view the schedule for your trip.
              </h4>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
