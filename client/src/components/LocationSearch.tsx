import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, LoadScript, StandaloneSearchBox, Marker, Circle, useJsApiLoader } from '@react-google-maps/api';
import { MdMyLocation } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import { UseFormSetValue, FieldValues, UseFormRegister } from 'react-hook-form';

const containerStyle = {
  width: '100%',
  height: '320px'
};

const defaultCenter = {
    lat: -34.397,
    lng: 150.644
};

const options = {
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
}

export interface Location {
  lat: number;
  lng: number;
}

interface LocationProps {
  onSelectLocation: (location: Location) => void;
  position: Location | null;
  radius?: number; // Added radius prop
  required?: boolean;
}

const LocationSearch = ({ 
  onSelectLocation, 
  position,
  radius, // Accepts radius as a prop
  required
}:LocationProps) => {
  const [map, setMap] = useState<google.maps.Map>();
  const [circle, setCircle] = useState<google.maps.Circle | null>();
  const [center, setCenter] = useState<Location>(defaultCenter);
  const searchBoxRef = useRef<google.maps.places.SearchBox>();

  const onLoad = useCallback((ref: google.maps.places.SearchBox) => {
    searchBoxRef.current = ref;
  }, []);

  const onPlacesChanged = () => {
    const places = searchBoxRef.current?.getPlaces();
    if (places && places.length) {
      const place = places[0]
      const loc = place.geometry?.location;

      const newPosition = {
        lat: loc!.lat(),
        lng: loc!.lng()
      };

      onSelectLocation(newPosition);

      if (map) {
        map.setCenter(newPosition);
        map.setZoom(15);
      }
    }
  };

  const onLoadMap = useCallback((map: google.maps.Map) => {
    setMap(map);

    if (navigator.geolocation && !position) {
        navigator.geolocation.getCurrentPosition((position) => {
            const newPos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            }

            onSelectLocation(newPos);
            map.setCenter(newPos);
            map.setZoom(15)
        });
    } else if (position) {
        map.setCenter(position);
        map.setZoom(15);
    }
    
  }, [center, onSelectLocation]);

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const newPos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        onSelectLocation(newPos);
        map?.setCenter(newPos);
        map?.setZoom(15);
      }, () => {
        alert('Error: The Geolocation service failed.');
      });
    } else {
      alert("Error: Your browser doesn't support geolocation.");
    }
  };

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
    libraries: ['places'],
  });

  useEffect(() => {
    // Check for whether user removed selection
    if (radius === undefined){
      circle?.setMap(null);
      setCircle(null);
    }

    if (map && position && radius != undefined) {
      // Update old circle if it exists
      if (circle) {
          circle.setRadius(radius * 1000);
      } else {
        const newCircle = new google.maps.Circle({
            center: position,
            radius: radius * 1000,
            map: map,
            strokeColor: "#FF0000",
            strokeOpacity: 0.7,
            strokeWeight: 2,
            fillColor: "#FF0000",
            fillOpacity: 0.20,
        });
        setCircle(newCircle);
      }
    }
  }, [map, position, radius])

  return (
    <div>
    {isLoaded &&
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={position || center}
        zoom={10}
        onLoad={onLoadMap}
        options={options}
      >
        <StandaloneSearchBox
          onLoad={onLoad}
          onPlacesChanged={onPlacesChanged}
        >
          <div 
            className="
            flex 
            mt-6 
            items-center 
            w-full"
          >
          <FaLocationDot
            size={16} />
          <input
            type="text"
            placeholder="Search places"
            className="
              box-border 
              border 
              border-transparent 
              w-[90%] 
              h-[10%]
              px-3 
              rounded-full 
              shadow-md 
              text-sm 
              outline-none 
              overflow-ellipsis 
              absolute 
              left-1/2 
              -translate-x-1/2
              focus:border-black"
          />
          </div>
        </StandaloneSearchBox>
        {position && <Marker position={position} />}
      </GoogleMap>}
    <button
    onClick={handleLocationClick}
    className="
      mt-4 
      text-neutral-500
      hover:underline
      hover:text-black
      w-full
      font-medium 
      py-1 
      px-2 
      rounded
    ">
      <div className="
        flex 
        gap-2 
        justify-left
        align-items">
        <div className="inline mr-2 mt-1" >
          <MdMyLocation />
        </div> 
          Use Your Location
      </div>
    </button>
  </div>
  );
};

export default LocationSearch;
