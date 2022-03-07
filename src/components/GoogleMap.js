import React from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import mapStyles from "./mapStyles";
import NavBar from "./NavBar";
import { get, post } from "../http/service";

const libraries = ["places"];
const mapContainerStyle = {
  width: "100vw",
  height: "100vh",
};
const center = {
  lat: 29.0339,
  lng: 1.6596,
};
const options = {
  styles: mapStyles,
  disableDefaultUI: true,
  zoomControl: true,
};

export default function App() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });
  const [markers, setMarkers] = React.useState([]);
  const [selected, setSelected] = React.useState(null);
  const [newPlace, setNewPlace] = React.useState(null);
  // const [currentUsername, setCurrentUsername] = React.useState(myStorage.getItem("user"));
  const [title, setTitle] = React.useState(null);
  const [desc, setDesc] = React.useState(null);
  const [star, setStar] = React.useState(0);

  const onMapClick = React.useCallback((event) => {
    setMarkers((current) => [
      ...current,
      {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
        time: new Date(),
      },
    ]);
  }, []);

  const mapRef = React.useRef();
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  }, []);

  if (loadError) return "Error loadingmaps";
  if (!isLoaded) return "Loading Maps...";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      // username: currentUsername,
      title,
      desc,
      rating: star,
      lat: newPlace.lat,
      long: newPlace.long,
    }
    .then ((results) => {
      console.log("You created a new pin!", results.data);
      // localeStorage.setItem(newPin, results.data)
    })
  }

  return (
    <div>
      <NavBar />
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={2.7}
        center={center}
        options={options}
        onClick={onMapClick}
        onLoad={onMapLoad}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.time.toISOString()}
            position={{ lat: marker.lat, lng: marker.lng }}
            icon={{
              scaledSize: new window.google.maps.Size(30, 30),
              origin: new window.google.maps.Point(0, 0),
              anchor: new window.google.maps.Point(15, 15),
            }}
            onClick={() => {
              setSelected(marker);
            }}
          />
        ))}

        {selected ? (
          <InfoWindow
              latitude={newPlace.lat}
              longitude={newPlace.long}
              closeButton={true}
              closeOnClick={false}
              onClose={() => setNewPlace(null)}
              anchor="left"
            >
              <div>
                <form onSubmit={handleSubmit}>
                  <label>Title</label>
                  <input
                    placeholder="Enter a title"
                    autoFocus
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <label>Description</label>
                  <textarea
                    placeholder="Say us something about this place."
                    onChange={(e) => setDesc(e.target.value)}
                  />
                  <label>Rating</label>
                  <select onChange={(e) => setStar(e.target.value)}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                  <button type="submit" className="submitButton">
                    Add Pin
                  </button>
                </form>
              </div>
            </InfoWindow>
        ) : null}
      </GoogleMap>
    </div>
  );
}

// const Pin = () => {
//   const [username, setUsername] = React.useState("");
//   const [title, setTitle] = React.useState("");
//   const [description, setDescription] = React.useState("");
//   const [rating, setRating] = React.useState("");
//   const [lat, setLat] = React.useState("");
//   const [long, setLong] = React.useState("");