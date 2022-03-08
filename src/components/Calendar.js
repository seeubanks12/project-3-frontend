import React from "react";
import { useRef } from "react";
import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import NavBar from "./NavBar";
import PlanTrip from "./PlanTrip";
import { get, post } from "../http/service";
import moment from "moment";

const Calendar = () => {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [events, setEvents] = React.useState([]);
  const calendarRef = useRef(null);

  const onEventAdded = (event) => {
    let calendarApi = calendarRef.current.getApi();
    calendarApi.addEvent(event, {
      start: moment(event.start).toDate(),
      end: moment(event.end).toDate(),
      title: event.title,
      location: event.location,
      description: event.description,
    });
  };

  async function handleEventAdd(data) {
    await post("/api/calendar/plan-trip", data.event);
  }

  async function handleDatesSet(data) {
    const response = await get(
      "/api/calendar?start=" +
        moment(data.start).toISOString() +
        "&end=" +
        moment(data.end).toISOString()
    );
    setEvents(response.data);
  }

  return (
    <div>
      {/* <NavBar /> */}
      <button onClick={() => setModalOpen(true)}>Add Event</button>

      <div>
        <FullCalendar
          ref={calendarRef}
          events={events}
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          eventAdd={(event) => handleEventAdd(event)}
          datesSet={(date) => handleDatesSet(date)}
        />
      </div>

      <PlanTrip
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onEventAdded={(event) => onEventAdded(event)}
      />
    </div>
  );
};

export default Calendar;
