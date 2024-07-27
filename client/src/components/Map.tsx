import { GoogleMap, Marker, StandaloneSearchBox, useJsApiLoader } from '@react-google-maps/api';
import { useCallback, useRef, useState } from 'react'
import { FaLocationDot } from 'react-icons/fa6';
import { MdMyLocation } from 'react-icons/md';

const containerStyle = {
  width: '100%',
  height: '60vh'
};

const defaultCenter = {
  lat: -6.21154400,
  lng: 106.84517200
};

const options = {
  mapTypeControl: false,
  fullscreenControl: false,
  styles: [{
    featureType: 'poi',
    elementType: 'labels',
    stylers: [{ visibility: 'off'}]
  },
  {
    featureType: "poi.business",
    elementType: "all",
    stylers: [{ visibility: "off" }]
  },
]
}

const libraries = ["places"];

export interface Location {
    lat: number;
    lng: number;
}

interface MapProps {
  position: Location | null,
  setPosition: (position: Location) => void;
}

const Map = ({
  position,
  setPosition
}:MapProps) => {
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [center, setCenter] = useState<Location>(defaultCenter);
    const searchBoxRef = useRef<google.maps.places.SearchBox>();

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
        //@ts-ignore
        libraries
    })

    const onLoadSearch = useCallback((ref: google.maps.places.SearchBox) => {
        searchBoxRef.current = ref;
      }, []);

    const onLoadMap = (map: google.maps.Map) => {
        setMap(map);

        if (navigator.geolocation && !position) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    }
                    setCenter(pos);
                    setPosition(pos);
                    map.setZoom(18);
                    map.panTo(pos);
                },
                () => {
                    alert('Error: The Geolocation service failed.');
                }
            );
        } else if (position) {
            map.setCenter(position);
            map.setZoom(16);
        }

    }

    const onPlacesChanged = () => {
        const places = searchBoxRef.current?.getPlaces();
        if (places && places.length > 0) {
            const place = places[0];
            const location = place.geometry?.location;

            if (location) {
                const newCenter = {
                    lat: location.lat(),
                    lng: location.lng()
                }
                setCenter(newCenter);
                setPosition(newCenter);
                map?.panTo(newCenter);
            }
        }
    }

    const handleMapClick = (e: google.maps.MapMouseEvent) => {
        const lat = e.latLng?.lat();
        const lng = e.latLng?.lng();

        if (lat && lng) {
            setPosition({lat, lng});
            setCenter({lat, lng});
            map?.panTo({lat, lng});
        }

        console.log(position);
    };

    const handleUserLocationClick = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    }

                    setCenter(pos);
                    setPosition(pos);
                },
                () => {
                    alert('Error: The Geolocation service failed.');
                }
            );
        }
    }

    console.log('Rendering Marker at position:', position);

  return (
    <div>
    {isLoaded && (
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={position || center}
        zoom={10}
        onLoad={onLoadMap}
        options={options}
        onClick={handleMapClick}
      >
        <StandaloneSearchBox
          onLoad={onLoadSearch}
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
              h-[8%]
              px-3 
              rounded-full 
              shadow-md 
              text-sm 
              outline-none 
              overflow-ellipsis 
              absolute 
              left-1/2 
              translate-y-1/2
              -translate-x-1/2
              focus:border-black"
          />
          </div>
        </StandaloneSearchBox>
        {position && <Marker position={position} />}
      </GoogleMap>
    )}
    <button
    onClick={handleUserLocationClick}
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
      bg-white
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
  )
}

export default Map