import React from "react";
import Modal from "react-modal";
import NavBar from "../components/NavBar";
import Datetime from "react-datetime";

const PlanTrip = ({ isOpen, onClose, onEventAdded }) => {
  const [title, setTitle] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [start, setStart] = React.useState(new Date());
  const [end, setEnd] = React.useState(new Date());

  const onSubmit = (event) => {
    event.preventDefault();

    onEventAdded({
      title,
      location,
      description,
      start,
      end,
    });
    onClose();
  };

  return (
    <div>
      <Modal isOpen={isOpen} onRequestClose={onClose}>
        <form onSubmit={onSubmit}>
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {/* SOMETHING HERE TO ADD PINS FROM MAP? */}

          <label>Start Date</label>
          <Datetime value={start} onClick={(date) => setStart(date)} />

          <label>End Date</label>
          <Datetime value={end} onClick={(date) => setEnd(date)} />
          <button>Add Event</button>
        </form>
      </Modal>
    </div>
  );
};

export default PlanTrip;
