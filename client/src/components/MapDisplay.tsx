import React, { useEffect, useState } from 'react'
import { Location } from './Map';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import LocationSummary from './LocationSummary';

const containerStyle = {
    width: '100%',
    height: '60vh'
};

const libraries = ["places"];

const defaultCenter:Location = {
    lat: -6.21154400,
    lng: 106.84517200
};

const options = {
    mapTypeControl: false,
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

export type Detection = {
    id:string,
    hasCracks:boolean,
    hasObstacles:boolean,
    hasParkedVehicles:boolean,
    hasSidewalk:boolean,
    hasTactilePath:boolean,
    hasVendors:boolean,
    location:boolean
    title:string,
}

const MapDisplay = () => {
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [detections, setDetections] = useState<Detection[]>([]);
    const [selectedDetection, setSelectedDetection] = useState<Detection | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [center, setCenter] = useState<Location>(defaultCenter);

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
        //@ts-ignore
        libraries
    })

    useEffect(() => {
        const fetchDetections = async () => {
            try {
                const snapshot = await getDocs(collection(db, 'detections'));
                const detectionsList = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }))
                //@ts-ignore
                setDetections(detectionsList);
            } catch (error) {
                console.log('Error fetching detections: ', error);
            }
        };

        fetchDetections();
    }, [])

    console.log(detections.length);

    const handleMarkerClick = (detection:Detection) => {
        setSelectedDetection(detection);
        setIsDrawerOpen(true);
    }

  return (
    <div 
    className="min-h-screen"
    >
        {isLoaded ? (
            <GoogleMap 
                mapContainerStyle={containerStyle}
                center={defaultCenter}
                zoom={12}
                options={options}
                onLoad={map => setMap(map)}
            >
                {detections.map((detection) => {
                    return (
                    <Marker
                        key={detection.id}
                        position={{
                            //@ts-ignore
                            lat: detection.location.latitude,
                            //@ts-ignore
                            lng: detection.location.longitude,
                          }}
                        onClick={() => handleMarkerClick(detection)}
                    />
                        )
                })}
            </GoogleMap>
        ) : (
            <div> Loading... </div>
        )}
        <LocationSummary />
    </div>
  )
}

export default MapDisplay