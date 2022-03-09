import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import TripForm from "./FormModal";
import TripCard from "./TripCard";
// import "./main.scss";
import moment from "moment-timezone";
import NavBar from "./NavBar"
import { get, post } from "../http/service";
import { useNavigate } from "react-router-dom";

const Calendar = () => {
  const [state, setState] = React.useState ( {
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
    get("/api/trip/view-trip").then((resp) => {
      setState({
        ...state,
        eventSources: resp.data[0].trip?.map((e) => {
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
  };

  const calendarComponentRef = React.createRef();

  // show trip card
  const handleEventClick = (event) => {
    // get the trip's id from database
    setState({
      ...state,
      showCard: "true",
    });
    handleTrip(event.event.extendedProps._id);
  };

  // trip's delete button
  const handleDeleteClick = () => {
    setState({
      ...state,
      showCard: false,
    });
    handleDeleteTrip(state.id);
  };

  // trip's save changes button
  const handleUpdateClick = () => {
    if (
      state.title &&
      state.start &&
      state.end &&
      state.description
    ) {
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

  // get trip's data from database
  const handleTrip = (id) => {
    get("/api/trip/view-trip")
      .then((res) => {
        const dateStart = res.data.start;
        const start = moment(dateStart).tz("UTC").format("YYYY-MM-DD");
        const dateEnd = res.data.end;
        const end = moment(dateEnd).tz("UTC").format("YYYY-MM-DD");
        setState({
          ...state,
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
  const handleDeleteTrip = () => {
    post("api/trip/delete-trip")
      .then(() => {
        localStorage.clear();
        navigate("/view-calendar");
      })
      .catch((err) => console.log(err));
  };

  // update a trip
  const handleUpdateTrip = (id) => {
    // console.log(state);
    post("/api/trip/update-trip")
      .update(id, state)
      .then((foundTrip) => {
        localStorage.setItem("trip", foundTrip.data);
        navigate("/view-calendar");
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
    if (
      state.title &&
      state.start &&
      state.end &&
      state.description
    ) {
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
      <div className="demo-app-calendar"  >
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
          events={state.eventSources}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
        />
      </div>
    </div>
  );
};

export default Calendar;
