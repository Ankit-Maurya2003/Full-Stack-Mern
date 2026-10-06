import React, { useState } from "react";

const Location = () => {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getCurrentLocation = () => {
    setError("");
    setAddress("");
    setLoading(true);

    if (!navigator.geolocation) {
      setError("Your browser does not support location.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        setLocation({
          latitude,
          longitude,
        });

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );

          const data = await response.json();

          console.log("Address Data:", data);

          setAddress(data.display_name);
        } catch (error) {
          console.log(error);
          setError("Unable to find address.");
        } finally {
          setLoading(false);
        }
      },

      (error) => {
        console.log(error);

        setLoading(false);

        if (error.code === 1) {
          setError("Location permission denied.");
        } else if (error.code === 2) {
          setError("Location unavailable.");
        } else if (error.code === 3) {
          setError("Location request timed out.");
        } else {
          setError("Something went wrong.");
        }
      }
    );
  };

  return (
    <div>
      <button onClick={getCurrentLocation}>
        📍 Use Current Location
      </button>

      {loading && <p>Getting your location...</p>}

      {location && (
        <div>
          <p>
            Latitude: {location.latitude}
          </p>

          <p>
            Longitude: {location.longitude}
          </p>
        </div>
      )}

      {address && (
        <div>
          <h3>📍 Your Address</h3>
          <p>{address}</p>
        </div>
      )}

      {error && <p>{error}</p>}
    </div>
  );
};

export default Location;