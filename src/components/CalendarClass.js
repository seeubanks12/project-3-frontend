import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import TripForm from "./FormModal";
import TripCard from "./TripCard";
// import "./main.scss";
import moment from "moment-timezone";
import { get, post } from "../http/service";
import { useNavigate } from "react-router-dom";

class Calendar extends React.Component {
  state = {
    calendarWeekends: true,
    eventSources: [],
    id: "",
    title: "",
    location: "",
    start: new Date(),
    end: new Date(),
    description: "",
    showModal: false,
    errorTitle: "",
    errorLocation: "",
    errorStart: "",
    errorEnd: "",
    errorDescription: "",
    showCard: false,
    users: [],
    guests: [],
  };

  componentDidMount() {
    this.refreshTrips();
    // this.getAllUsers();
  }

  // get all users for guests list
  // getAllUsers() {
  //   axios.getAllUsers().then(resp => {
  //     this.setState({
  //       users: resp.data
  //     });
  //   });
  // }

  // display trip on calendar
  refreshTrips() {
    get("/api/trip/view-calendar").then((resp) => {
      this.setState({
        eventSources: resp.data[0]?.trip.map((e) => {
          let start = moment(e.start).tz("UTC").format("DD-MM-YYYY");
          let end = moment(e.end).tz("UTC").add(1, "days").format("DD-MM-YYYY");
          return {
            ...e,
            start: start,
            end: end,
          };
        }),
      });
    });
  }

  calendarComponentRef = React.createRef();

  // show trip card
  handleEventClick = (event) => {
    // get the trip's id from database
    this.setState({
      showCard: "true",
    });
    this.handleTrip(event.event.extendedProps._id);
  };

  // trip's delete button
  handleDeleteClick = () => {
    this.setState({
      showCard: false,
    });
    this.handleDeleteTrip(this.state.id);
  };

  // trip's save changes button
  handleUpdateClick = () => {
    if (
      this.state.title &&
      this.state.start &&
      this.state.end &&
      this.state.description
    ) {
      this.setState({
        showCard: false,
      });
      this.handleUpdateTrip(this.state.id);
      this.setState({
        errorTitle: "",
        errorLocation: "",
        errorStart: "",
        errorEnd: "",
        errorDescription: "",
      });
    } else {
      this.setState({
        errorTitle: "*Please enter your trip name",
        errorLocation: "*Please enter your trip location",
        errorStart: "*Please enter the start date",
        errorEnd: "*Please enter the end date",
        errorDescription: "*Please enter the description",
      });
    }
  };

  // get trip's data from database
  handleTrip = (id) => {
    get("/api/trip/view-trip")
      .then((res) => {
        const dateStart = res.data.start;
        const start = moment(dateStart).tz("UTC").format("YYYY-MM-DD");
        const dateEnd = res.data.end;
        const end = moment(dateEnd).tz("UTC").format("YYYY-MM-DD");
        this.setState({
          id: res.data._id,
          title: res.data.title,
          location: res.data.location,
          start: start,
          end: end,
          description: res.data.description,
          guests: res.data.guests,
        });
      })
      .catch((err) => console.log(err));
  };

  // delete a trip
  handleDeleteTrip = () => {
    const navigate = useNavigate();
    post("api/trip/delete-trip")
      .then(() => {
        localStorage.clear();
        navigate("/view-calendar");
      })
      .catch((err) => console.log(err));
  };

  // update a trip
  handleUpdateTrip = (id) => {
    const navigate = useNavigate();
    // console.log(this.state);
    post("/api/trip/update-trip")
      .update(id, this.state)
      .then((foundTrip) => {
        localStorage.setItem("trip", foundTrip.data);
        navigate("/view-calendar");
      })
      .catch((err) => console.log(err));
  };

  handleInputChange = (event) => {
    // Getting the value and name of the input which triggered the change
    let value = event.target.value;
    const name = event.target.name;
    // Updating the input's state
    this.setState({
      [name]: value,
    });
  };

  // toggleWeekends = () => {
  //   this.setState({
  //     // update a property
  //     calendarWeekends: !this.state.calendarWeekends,
  //   });
  // };

  gotoPast = () => {
    let calendarApi = this.calendarComponentRef.current.getApi();
    calendarApi.gotoDate("2000-01-01"); // call a method on the Calendar object
  };

  // close modal and clear input
  handleCloseClick = () => {
    this.setState({
      showModal: false,
      showCard: false,
      errorTitle: "",
      errorStart: "",
      errorLocation: "",
      errorEnd: "",
      errorDescription: "",
    });
  };

  // click calendar
  handleDateClick = () => {
    this.setState({
      startDate: new Date(),
      showModal: true,
      title: "",
      location: "",
      start: new Date().getUTCHours(),
      end: new Date().getUTCHours(),
      description: "",
    });
  };

  // guests list
  handleGuestsChange = (event) => {
    //Can't do filter and map on HTMLCollections
    let asArr = Array.prototype.slice.call(event.target.options);
    let guestIds = asArr
      .filter((option) => option.selected)
      .map((option) => option.value);

    this.setState({
      guests: guestIds,
    });
  };

  // save a new trip
  handleSaveTrip = () => {
    // const navigate = useNavigate();
    if (
      this.state.title &&
      this.state.start &&
      this.state.end &&
      this.state.description
    ) {
      post("/api/trip/plan-trip", this.state)
        // .saveTrip(this.state)
        .then(() => {
          // this.refreshTrips();
          this.setState({
            showModal: false,
          });
        })
        .catch((err) => console.log(err));
      this.setState({
        title: "",
        location: "",
        start: new Date().getUTCHours(),
        end: new Date().getUTCHours(),
        description: "",
        errorTitle: "",
        errorLocation: "",
        errorStart: "",
        errorEnd: "",
        errorDescription: "",
        guests: [],
      });
    } else {
      this.setState({
        errorTitle: "*Please enter your trip name",
        errorLocation: "*Please enter your trip location",
        errorStart: "*Please enter the start date",
        errorEnd: "*Please enter the end date",
        errorDescription: "*Please enter the description",
      });
      // navigate("/view-calendar");
    }
  };
  render() {
    return (
      <div className="demo-app">
        <TripForm
          show={this.state.showModal}
          {...this.state}
          close={this.handleCloseClick}
          save={() => this.handleSaveTrip()}
          handleInputChange={this.handleInputChange}
          handleGuestsChange={this.handleGuestsChange}
        />
        <TripCard
          show={this.state.showCard}
          {...this.state}
          close={this.handleCloseClick}
          delete={this.handleDeleteClick}
          save={this.handleUpdateClick}
          handleInputChange={this.handleInputChange}
          handleGuestsChange={this.handleGuestsChange}
        />
        <div className="demo-app-top mb-4">
          <button onClick={this.toggleWeekends} className="btn btn-dark">
            toggle weekends
          </button>
          &nbsp;
          <button onClick={this.gotoPast} className="btn btn-dark">
            go to a date in the past
          </button>
          &nbsp; (also, click a date/time to add an event)
        </div>
        <div className="demo-app-calendar">
          <FullCalendar
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
            }}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            ref={this.calendarComponentRef}
            weekends={this.state.calendarWeekends}
            events={this.state.eventSources}
            dateClick={this.handleDateClick}
            eventClick={this.handleEventClick}
          />
        </div>
      </div>
    );
  }
}

export default Calendar;
