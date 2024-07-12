import React, { useEffect, useRef, useState } from 'react';
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from './shadcn/ui/drawer'
import { Detection } from './MapDisplay';
import { FaRoadCircleXmark } from "react-icons/fa6";
import { FaRoadBarrier } from "react-icons/fa6";
import { MdOutlineNotAccessible } from "react-icons/md";
import { FaCarOn } from "react-icons/fa6";
import { FaBusAlt } from "react-icons/fa";

interface SelectedDisplayProps {
  detection: Detection | null;
  isOpen: boolean;
  onClose: () => void;
}

const SelectedDisplay = ({ detection, isOpen, onClose }:SelectedDisplayProps) => {
    const panoramaRef = useRef<HTMLDivElement | null>(null);
    const [places, setPlaces] = useState<any[]>([]);

    useEffect(() => {
        if (isOpen && panoramaRef.current && detection) {
            const { latitude, longitude } = detection.location;
    
            const panorama = new google.maps.StreetViewPanorama(panoramaRef.current, {
            position: { lat: latitude, lng: longitude },
            pov: { heading: 165, pitch: 0 },
            zoom: 1,
            });
        }
      }, [isOpen, detection]);

  if (!detection) return null;

//   useEffect(() => {
//     if (isOpen && detection && panoramaRef.current) {
//         const { latitude, longitude } = detection.location;

//       new google.maps.StreetViewPanorama(panoramaRef.current, {
//         position: { lat: latitude, lng: longitude },
//         pov: { heading: 165, pitch: 0 },
//         zoom: 1,
//       });

//       const service = new google.maps.places.PlacesService(panoramaRef.current);

//       const request = {
//         location: { lat: latitude, lng: longitude },
//         radius: 500,
//         type: ['school', 'transit_station'],
//       };

//       service.nearbySearch(request, (results, status) => {
//         if (status === google.maps.places.PlacesServiceStatus.OK && results) {
//           setPlaces(results);
//         }
//       });
//     }
//   }, [isOpen, detection]);

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerTrigger asChild>
        <button 
        className="
        bg-neutral-900
        py-2
        w-full
        mx-4
        "
        onClick={onClose}>
            Close
        </button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
            <DrawerTitle>Ramah pejalan</DrawerTitle>
            <DrawerDescription className="text-neutral-700">
                {detection.title}
            </DrawerDescription>
        </DrawerHeader>
        <div className="
            p-4
            flex
            flex-col
            gap-y-4
        ">
            <div className="
                flex
                flex-row
                rounded-lg
                bg-neutral-800
                shadow-md
                min-h-[60px]
                p-4
                text-white
            ">
                <div className="
                    flex 
                    flex-col
                    gap-y-1
                    w-[75%]
                ">
                {detection.hasCracks && 
                <div className="flex flex-row gap-x-2">
                    <MdOutlineNotAccessible size={20}/>
                    Trotoar tidak rata
                </div>}
                {detection.hasObstacles && 
                <div className="flex flex-row gap-x-2">
                    <FaRoadBarrier size={20}/>
                    Adanya benda-benda penghambat
                </div>}
                {detection.hasObstacles && 
                <div className="flex flex-row gap-x-2">
                    <FaCarOn size={20}/>
                    Dihalangi parkir liar
                </div>}
                {detection.hasVendors && 
                <div className="flex flex-row gap-x-2">
                    <FaRoadCircleXmark size={20}/>
                    Dihalangi pendagang kaki lima
                </div>}
                {detection.hasTactilePath && 
                <div className="flex flex-row gap-x-2">
                    <FaRoadCircleXmark size={20}/>
                    Tidak ada jalur taktil bagi tuna netra
                </div>}
            </div>
          </div>

          <div className="py-2">
            <div style={{ width:'100%', height:'250px'}} ref={panoramaRef}></div>
          </div>
          <div className="
            border
            rounded-sm p-4">
            <div className="flex-row flex bg-white items-center gap-x-1 mb-2">
                <div className="bg-blue-500 p-1 rounded-md">
                <FaBusAlt color="white" size={16}/>
                </div>
                <div className="font-bold">
                    Fasilitas umum dalam 500m
                </div>
            </div>
            <div>
              query for all (1) transportation stations, and (2) schools in the area and display here
            </div>
          </div>
        </div>
        <DrawerFooter>
          <DrawerClose className="flex justify-center" asChild>
          <button 
            className="
            bg-neutral-900
            border-black
            text-white
            py-2
            w-full
            rounded-md
            hover:opacity-80
            "
            onClick={onClose}>
            Close
            </button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default SelectedDisplay;
