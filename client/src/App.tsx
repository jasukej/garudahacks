import { useEffect, useRef, useState } from 'react'
import './App.css'
import axios from 'axios'
import Map, { Location } from './components/Map'
import Footer from './components/Footer'
import { MdCameraAlt } from 'react-icons/md'
import { FaWalking } from 'react-icons/fa'
import AnalyzeModal from './components/modals/AnalyzeModal'
import useAnalyzeModal from './hooks/useAnalyzeModal'
import IssueSection from './components/IssueSection'

const defaultPosition:Location = {
  lat: -6.21154400,
  lng: 106.84517200
}

function App() {
  const [position, setPosition] = useState<Location>(defaultPosition);
  const mapRef = useRef<HTMLDivElement>(null);

  const scrollToMap = () => {
    if (mapRef.current) {
      mapRef.current.scrollIntoView({ 
        block: 'center',
        behavior: 'smooth' 
      });
    }
  }

  // // fetch backend api boilerplate
  // const fetchAPI = async () => {
  //   const response = await axios.get('http://localhost:8080/api/users');
  //   console.log(response.data.users);
  //   setArray(response.data.users);
  // }

  // useEffect(() => {
  //   fetchAPI();
  // }, [])

  const { isOpen, toggleModal } = useAnalyzeModal();
  
  return (
    <div className="
      relative
      min-h-screen
    ">
      <div className="
        bg-white
        min-h-full
        min-w-screen
        relative
      ">
        <div className="
        absolute
        top-0
        h-
      ">
      </div>
        {/* LANDING */}
        <div className="
          min-h-[70vh]
          items-center
          justify-center
          flex
        ">
        <div className="
          flex
          flex-col
          items-center
          gap-y-4
        ">
          <div className="
            text-4xl
            text-[#D72D2D]
            font-black
          ">
            jalankami
          </div>
          <div className="
            text-gray-700
            text-sm
          ">
            Membangun Jakarta ramah pejalan
          </div>
          <div 
          onClick={scrollToMap}
          className="
            rounded-full
            px-2
            py-2
            bg-[#C32828]
            border-black
            flex
            w-[12rem]
            justify-center
            items-center
            text-white
            font-semibold
            cursor-pointer
            hover:opacity-80
            active:opacity-100
          ">
            Laporkan isu
          </div>
        </div>
        </div>
        <div>
        {/* Map Component */}
        <div 
        ref={mapRef}
        className="
          min-h-screen
          mb-4
          px-8
          flex
          flex-col
          gap-y-4
        "> 
          <div className="
          
          ">
            Select an area on the map.
          </div>
          <Map 
            position={position}
            setPosition={setPosition}
          />
          {/* User buttons */}
          <div 
          className="
            flex
            flex-col
            gap-x-auto
            w-full
            justify-between
            gap-y-2
          ">
            <div 
            onClick={toggleModal}
            className="
              border
              border-grey-800
              flex
              flex-row
              gap-x-2
              items-center
              justify-center
              rounded-md
              cursor-pointer
              px-4
              py-2
              bg-neutral-800
              text-white
              hover:opacity-80
            ">
              <FaWalking size={20}/>
              Analyze walkability
            </div>
            <div 
            onClick={() => {}}
            className="
              border
              border-black
              flex
              flex-row
              gap-x-2
              items-center
              justify-center
              rounded-md
              cursor-pointer
              px-4
              py-2
            ">
              <MdCameraAlt size={20}/>
              Scan using camera
            </div>
          </div>
        </div>
          {/* Add display */}
        </div>
        {/* custom report */}
        <IssueSection />
        <Footer />
        <AnalyzeModal position={position}/>
      </div>
    </div>
  )
}

export default App

