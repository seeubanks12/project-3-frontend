import { get, post } from "../http/service";
import React, { Component } from "react";
import Clock from "./Clock";
import Calender from "./Calendar";

class Trips extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trips: [],
      show: false,
    };

    this.handleCalendarChange = this.handleCalendarChange.bind(this);
  }

  componentDidMount() {
    get("/api/trip/view-trip")
      .then((resp) => {
        console.log(resp.data);
        let tripData = resp.data[0].trip;

        this.setState({ tripData });
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  toggleTrip = () => {
    this.setState({
      show: !this.state.show,
    });
  };

  handleCalendarChange(didItChange) {
    post("/api/trip/view-trip")
      .then((resp) => {
        console.log(resp);
        let tripData = resp.data[0].trip;

        this.setState({
          trips: tripData,
        });
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  render() {
    return (
      <div>
        <div className="accordion" id="trip">
          {this.state.trips.map((trip) => {
            console.log(trip);
            return (
              <div className="card">
                <div
                  className="card-header"
                  id={trip._id}
                  onClick={this.toggleTrip}
                >
                  <h2 className="mb-0">
                    <button className="btn btn-link" type="button">
                      {trip.title}
                    </button>
                  </h2>
                </div>
                {this.state.show && (
                  <div id="a-trip">
                    <div className="card-body">
                      Guests: {trip.guests} <br />
                      Trip Start: <Clock deadline={trip.start} /> <br />
                      Description: {trip.description}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <Calender detectChange={this.handleCalendarChange} />
      </div>
    );
  }
}

export default Trips;
