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
import MapDisplay from './components/MapDisplay'
import FaqSection from './components/FaqSection'

function App() {
  
  const mapRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);

  const scrollToMap = () => {
    if (mapRef.current) {
      mapRef.current.scrollIntoView({ 
        block: 'center',
        behavior: 'smooth' 
      });
    }
  }

  const scrollToFaq = () => {
    if (faqRef.current) {
      faqRef.current.scrollIntoView({ 
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
      ">
      </div>
        {/* LANDING */}
        <div 
        style={{
          backgroundImage: 'url(src/assets/background_alt.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        className="
          min-h-[70vh]
          items-center
          justify-center
          flex
          relative
        ">
        
        <div className="
          flex
          flex-col
          items-center
          gap-y-4
        ">
          <div className="
            flex
            flex-col
            gap-y-1
          ">
            <div className="
              text-4xl
              text-[#D72D2D]
              font-black
            ">
              jalankami
            </div>
            <div className="
              text-black
              text-sm
            ">
              Membangun Jakarta ramah pejalan
            </div>
          </div>
          <div className="
            flex
            flex-col
            gap-y-3
          ">
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
          <div 
          onClick={scrollToFaq}
          className="
            rounded-full
            px-2
            py-2
            bg-white
            border-black
            border-[1.5px]
            flex
            w-[12rem]
            justify-center
            items-center
            text-black
            cursor-pointer
            hover:bg-neutral-200
            active:opacity-100
          ">
            Punya pertanyaan?
          </div>
          </div>
        </div>
        </div>
        <div ref={mapRef}>
        <MapDisplay />
        </div>
        {/* custom report */}
        <IssueSection />
        <div ref={faqRef}>
          <FaqSection />
        </div>
        <Footer />
      </div>
    </div>
  )
}

export default App

