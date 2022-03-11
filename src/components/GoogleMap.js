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
  // const [newPlace, setNewPlace] = React.useState(null);
  // const [currentUsername, setCurrentUsername] = React.useState(myStorage.getItem("user"));
  const [title, setTitle] = React.useState("");
  const [desc, setDesc] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [rating, setRating] = React.useState(0);
  const [id, setId] = React.useState("");

  React.useEffect(() => {
    getPins();
  }, []);

  const getPins = () => {
    get("/api/pin/view-all")
      .then((allPins) => {
        console.log(allPins.data);
        setMarkers(allPins.data);
        // setTitle(allPins.data.title);
        // setDesc(allPins.data.desc);
        // setRating(allPins.data.rating);
        // setLat(allPins.data.lat);
        // setLng(allPins.data.lng);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  // const onMapClick = React.useCallback((event) => {
  //   console.log("here");
  //   setMarkers((current) => [
  //     ...current,
  //     {
  //       lat: event.latLng.lat(),
  //       lng: event.latLng.lng(),
  //       time: new Date(),
  //     },
  //   ]);
  // }, []);

  const mapRef = React.useRef();
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  }, []);

  if (loadError) return "Error loadingmaps";
  if (!isLoaded) return "Loading Maps...";

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const newPin = {
  //     // username: currentUsername,
  //     title,
  //     desc,
  //     rating: star,
  //     lat: newPlace.lat,
  //     long: newPlace.long,
  //   }.then((results) => {
  //     console.log("You created a new pin!", results.data);
  //     // localeStorage.setItem(newPin, results.data)
  //   });
  // };

  //add new pin
  const savePin = (e) => {
    e.preventDefault();
    let url = id ? `edit-pin/${id}` : "add-pin";
    console.log("URL", url);
    console.log("markers", markers[0]);
    post(`/api/pin/${url}`, {
      title: title,
      description: desc,
      rating: rating,
      lat: markers[0].lat,
      lng: markers[0].lng,
    })
      .then((pinCreated) => {
        getPins();
        setSelected(null);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  console.log(markers);
  return (
    <div>
      <NavBar />
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={2.7}
        center={center}
        options={options}
        onClick={(e) => {
          setMarkers((current) => [
            ...current,
            {
              lat: e.latLng.lat(),
              lng: e.latLng.lng(),
              time: new Date(),
            },
          ]);
        }}
        onLoad={onMapLoad}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.time?.toISOString()}
            position={{ lat: marker.lat, lng: marker.lng }}
            icon={{
              url: null,
              scaledSize: new window.google.maps.Size(30, 30),
              origin: new window.google.maps.Point(0, 0),
              anchor: new window.google.maps.Point(15, 15),
            }}
            onClick={() => {
              console.log(marker);
              setSelected(marker);
              setTitle(marker.title);
              setDesc(marker.description);
              setRating(marker.rating);
              setId(marker._id);
            }}
          />
        ))}

        {selected ? (
          <InfoWindow
            position={{ lat: selected.lat, lng: selected.lng }}
            onCloseClick={() => {
              setSelected(null);
            }}
          >
            <form onSubmit={savePin}>
            <h6>Add Destination Information</h6>
              <input
                value={title}
                placeholder="Location"
                onChange={(e) => setTitle(e.target.value)}
              />
              <input
                value={desc}
                placeholder="Description"
                onChange={(e) => setDesc(e.target.value)}
              />
              <input
                value={rating}
                type="number"
                placeholder="Rating"
                onChange={(e) => setRating(e.target.value)}
              />

              <button type="submit">Submit</button>
            </form>
          </InfoWindow>
        ) : null}
      </GoogleMap>
    </div>
  );
}
