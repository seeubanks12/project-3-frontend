import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import TripForm from "./FormModal";
// import Trips from "./Trips";
import TripCard from "./TripCard";
// import "./main.scss";
import moment from "moment-timezone";
import NavBar from "./NavBar";
import { get, post } from "../http/service";
import { useNavigate } from "react-router-dom";

const Calendar = () => {
  const [state, setState] = React.useState({
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
  });

  const navigate = useNavigate();

  React.useEffect(() => {
    refreshTrips();
  }, []);

  // display trip on calendar
  const refreshTrips = () => {
    get("/api/trip/view-trip")
      .then((resp) => {
        console.log(resp.data);
        setState({
          ...state,
          showCard: false,
          eventSources: resp.data.map((e) => {
            let start = moment(e.start).tz("UTC").format("YYYY-MM-DD");
            let end = moment(e.end)
              .tz("UTC")
              .add(1, "days")
              .format("YYYY-MM-DD");
            return {
              ...e,
              start: start,
              end: end,
            };
          }),
        });
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const calendarComponentRef = React.createRef();

  // show trip card
  const handleEventClick = (event) => {
    // get the trip's id from database
    console.log("Handle event click");
    setState({
      ...state,
      showCard: true,
    });
    handleTrip(event.event.extendedProps._id);
  };

  // get trip's data from database

  const handleTrip = (id) => {
    console.log(id);
    get(`/api/trip/view-trip/${id}`)
      .then((res) => {
        console.log("This is a trip", res.data);
        const dateStart = res.data.start;
        const start = moment(dateStart).tz("UTC").format("YYYY-MM-DD");
        const dateEnd = res.data.end;
        const end = moment(dateEnd).tz("UTC").format("YYYY-MM-DD");
        setState({
          ...state,
          showCard: true,
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

  // trip's delete button
  const handleDeleteClick = () => {
    console.log("Handle Delete click");
    setState({
      ...state,
      showCard: false,
    });
    handleDeleteTrip(state.id);
  };

  // trip's save changes button
  const handleUpdateClick = () => {
    console.log("Handle update click");
    if (state.title && state.start && state.end && state.description) {
      setState({
        ...state,
        showCard: false,
      });
      handleUpdateTrip(state.id);
      setState({
        ...state,
        errorTitle: "",
        errorLocation: "",
        errorStart: "",
        errorEnd: "",
        errorDescription: "",
      });
    } else {
      setState({
        ...state,
        errorTitle: "*Please enter your trip name",
        errorLocation: "*Please enter your trip location",
        errorStart: "*Please enter the start date",
        errorEnd: "*Please enter the end date",
        errorDescription: "*Please enter the description",
      });
    }
  };

  // delete a trip
  const handleDeleteTrip = (id) => {
    post(`/api/trip/delete-trip/${id}`)
      .then(() => {
        localStorage.removeItem("trip");
        refreshTrips();
      })
      .catch((err) => console.log(err));
  };

  // update a trip
  const handleUpdateTrip = (id) => {
    // console.log(state);
    post(`/api/trip/update-trip/${id}`, state)
      // .update(id, state)
      .then((foundTrip) => {
        localStorage.setItem("trip", foundTrip.data);
        refreshTrips();
      })
      .catch((err) => console.log(err));
  };

  const handleInputChange = (event) => {
    // Getting the value and name of the input which triggered the change
    let value = event.target.value;
    const name = event.target.name;
    // Updating the input's state
    setState({
      ...state,
      [name]: value,
    });
  };

  // toggleWeekends = () => {
  //   setState({
  // ...state,
  //     // update a property
  //     calendarWeekends: !state.calendarWeekends,
  //   });
  // };

  const gotoPast = () => {
    let calendarApi = calendarComponentRef.current.getApi();
    calendarApi.gotoDate("2000-01-01"); // call a method on the Calendar object
  };

  // close modal and clear input
  const handleCloseClick = () => {
    console.log("Handle close click");
    setState({
      ...state,
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
  const handleDateClick = () => {
    setState({
      ...state,
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
  const handleGuestsChange = (event) => {
    //Can't do filter and map on HTMLCollections
    let asArr = Array.prototype.slice.call(event.target.options);
    let guestIds = asArr
      .filter((option) => option.selected)
      .map((option) => option.value);

    setState({
      ...state,
      guests: guestIds,
    });
  };

  // save a new trip
  const handleSaveTrip = () => {
    // const navigate = useNavigate();
    if (state.title && state.start && state.end && state.description) {
      post("/api/trip/plan-trip", state)
        // .saveTrip(state)
        .then(() => {
          // refreshTrips();
          setState({
            ...state,
            showModal: false,
          });
          navigate("/view-calendar");
        })
        .catch((err) => console.log(err));
      setState({
        ...state,
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
      setState({
        ...state,
        errorTitle: "*Please enter your trip name",
        errorLocation: "*Please enter your trip location",
        errorStart: "*Please enter the start date",
        errorEnd: "*Please enter the end date",
        errorDescription: "*Please enter the description",
      });
    }
  };
  console.log("card and modal", state.showCard, state.showModal);
  return (
    <div className="demo-app">
      <NavBar />
      <TripForm
        show={state.showModal}
        {...state}
        close={handleCloseClick}
        save={() => handleSaveTrip()}
        handleInputChange={handleInputChange}
        handleGuestsChange={handleGuestsChange}
      />
      <TripCard
        show={state.showCard}
        {...state}
        close={handleCloseClick}
        delete={handleDeleteClick}
        save={handleUpdateClick}
        handleInputChange={handleInputChange}
        handleGuestsChange={handleGuestsChange}
      />
      <div className="demo-app-top mb-4">
        &nbsp;
        <button onClick={gotoPast} className="btn btn-dark">
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
          ref={calendarComponentRef}
          weekends={state.calendarWeekends}
          // events={[
          //   {
          //     start: "2022-03-15",
          //     end: "2022-03-22",
          //   },
          // ]}
          events={state.eventSources}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
        />
      </div>
    </div>
  );
};

export default Calendar;
