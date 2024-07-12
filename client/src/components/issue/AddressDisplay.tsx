import React, { useState, useEffect } from 'react';
import { FaLocationDot } from 'react-icons/fa6';

interface AddressDisplayProps {
    lat: number,
    lng: number
}

const AddressDisplay = ({ lat, lng }:AddressDisplayProps) => {
  const [address, setAddress] = useState('');

  useEffect(() => {
    const getRoadAddress = async () => {
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;

      try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.status === 'OK') {
          const address = data.results[0].formatted_address;
          setAddress(address);
        } else {
          throw new Error('Geocoding API request failed');
        }
      } catch (error) {
        console.error('Error fetching address:', error);
      }
    };

    if (lat !== undefined && lng !== undefined) {
        getRoadAddress();
    } else {
    console.error('Lat and Lng are undefined');
    }
  }, [lat, lng]);

  const sliceAddress = (address:string) => {
    const noIndex = address.indexOf('No.');
    if (noIndex !== -1) {
      return address.slice(0, noIndex).trim();
    }
    return address; 
  };

  return (
    <div className="
        text-red-500 
        flex
        flex-row
        items-center
        gap-x-1
    ">
      <FaLocationDot size={18}/>
      <div>{sliceAddress(address)}</div>
    </div>
  );
};

export default AddressDisplay;