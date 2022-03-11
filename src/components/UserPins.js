import React from "react";
// import GoogleMaps from "./GoogleMaps";
import NavBar from "./NavBar";
import { get, post } from "../http/service";
import { useNavigate } from "react-router-dom";

const UserPins = () => {
  const [pins, setPins] = React.useState([]);
  const [title, setTitle] = React.useState("");
  const [desc, setDesc] = React.useState("");
  const [rating, setRating] = React.useState("");
  const [lat, setLat] = React.useState("");
  const [lng, setLng] = React.useState("");

  const navigate = useNavigate();

  React.useEffect(() => {
    get("/api/pin/view-all")
      .then((allPins) => {
        console.log(allPins.data);
        setPins(allPins.data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  const updatePin = (e) => {
    console.log(updatePin);
    e.preventDefault();
    post(
      "/api/pin/edit-pin/:id",
      {
        title,
        desc,
        rating,
        lat,
        lng,
      },
      { new: true }
    ).then((foundPin) => {
      console.log("We found this pin", foundPin.data);
      localStorage.setItem("pin", foundPin.data);
      navigate("/view-all");
    });
  };

  const deletePin = (id) => {
    // e.preventDefault();
    post(`/api/pin/delete-pin/${id}`)
      .then(() => {
        localStorage.removeItem("pin");
        let filteredPins = pins.filter((pin) => {
          return pin._id !== id;
        });
        setPins(filteredPins);
      })
      .catch((err) => {
        console.error(err.message);
      });
  };

  return (
    <div>
      <NavBar />
      <div className="bg-danger py-5 px-5">
        <h2 className="text-light text-center">All Pins</h2>
        {pins.map((pins) => (
          <div class="row">
            <div class="col-lg-4">
              <div class="card card-margin">
                <div class="card-header no-border">
                  <h5 class="card-title">Location: {pins.title}</h5>
                </div>
                <div class="card-body pt-0">
                  <div class="widget-49">
                    <ul class="widget-49-meeting-points">
                      <li class="widget-49-meeting-item">
                        <span>Description: {pins.description}</span>
                      </li>
                      <li class="widget-49-meeting-item">
                        <span>Rating: {pins.rating}</span>
                      </li>
                    </ul>
                    <div class="widget-49-meeting-action">
                      <button
                        onClick={() => deletePin(pins._id)}
                        class="btn btn-sm btn-danger"
                      >
                        Delete Pin
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserPins;
