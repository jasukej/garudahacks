import React, { CSSProperties, useCallback, useMemo, useState } from 'react'
import useAnalyzeModal from '../../hooks/useAnalyzeModal';
import Map, { Location } from '../Map';
import axios from 'axios';
import Modal from './Modal';
import { ToastContainer, toast } from 'react-toastify';
import BounceLoader from "react-spinners/BounceLoader"
import { Detection } from '../MapDisplay';
import { db } from '../../config/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { FaCarOn, FaRoadBarrier, FaRoadCircleXmark, FaShop } from 'react-icons/fa6';
import { MdOutlineNotAccessible } from 'react-icons/md';

const override: CSSProperties = {
  display: "block",
  borderColor: "red",
};

const defaultPosition:Location = {
  lat: -6.21154400,
  lng: 106.84517200
}

enum STEPS {
  LOCATION_SELECT = 0,
  DETECTIONS = 1,
}

const AnalyzeModal = () => {
  const [position, setPosition] = useState<Location>(defaultPosition);
  const { isOpen, toggleModal } = useAnalyzeModal();
  const [detection, setDetection] = useState<Detection | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);

  const onNext = useCallback(() => {
    setStep((prev) => prev + 1)
  }, [])

  const submitLabel = useMemo(() => {
      if (step == STEPS.LOCATION_SELECT) {
          return 'Scan sidewalk';
      }
      
      return 'Save scan';
  }, [step])

  const addToFirestore = async (detection:Detection) => {
    try {
      await addDoc(collection(db, 'detections'), {
        ...detection
      })
    } catch (error) {
      console.error("Error adding detection to Firestore: ", error);
    }
  }

  const onSubmit = async () => {
    if (step === STEPS.DETECTIONS) {

      if (detection) {
        await addToFirestore(detection);
      }

      setStep(0)
      return toggleModal()
    }

    console.log(position)
    if (position) {
      setLoading(true);
      onNext();
      try {
        const url = `http://localhost:8080/analyze?lat=${position.lat}&lng=${position.lng}`
        const response = await axios.get(url);
        console.log(response);
        setDetection(response.data);
      } catch (error) {
        toast.error('No street view images found.', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          });
      } finally {
        setLoading(false);
      }
    }
  } 

  let bodyContent = (
    <div>
      <div className="text-start">
      <div className="font-bold text-2xl">
        Pilih Lokasi
      </div>
      <div className="font-light mb-2">
        Tekan titik yang ingin anda <i>scan</i> di peta.
      </div>
      </div>
      <Map 
        position={position}
        setPosition={setPosition}
      />
    </div>
  )

  if (step === STEPS.DETECTIONS) {
    bodyContent = (
      <div>
        {loading ? (
          <div className="
            flex 
            justify-center 
            items-center
            h-full
          ">
          <BounceLoader
            color='#b92323'
            loading={loading}
            cssOverride={override}
            size={150}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
        ) : detection ? (
          <div className="text-start">
            <div className="font-bold text-2xl mb-4">Detection Results</div>
            {detection.imgURL && <img style={{height:'280px', width:'90%'}} src={detection.imgURL}/>}
            <div className="font-semibold text-lg">{detection.hasSidewalk ? 'Sidewalk detected' : 'No sidewalks along this road.'}</div>
            <div className='border p-4 border-neutral-200 mt-4 rounded-md shadow-xl'>
            <div className="font-semibold text-md mb-3">key issues</div>
            <ul className="flex flex-col gap-y-1">
              <li 
              className={`flex flex-row gap-x-1 ${!detection.hasCracks && 'line-through text-neutral-700'}`}>
                <MdOutlineNotAccessible size={20}/>Uneven surfaces
              </li>
              <li 
              className={`flex flex-row gap-x-1 ${!detection.hasObstacles && 'line-through text-neutral-700'}`}>
                <FaRoadBarrier size={20}/>Has obstacles
              </li>
              <li 
              className={`flex flex-row gap-x-1 ${!detection.hasParkedVehicles && 'line-through text-neutral-700'}`}>
                <FaCarOn size={20}/>Unregulated Parking
              </li>
              <li 
              className={`flex flex-row gap-x-1 ${!detection.hasVendors && 'line-through text-neutral-700'}`}>
                <FaShop size={20}/>Unregulated Vendors
              </li>
              <li 
              className={`flex flex-row gap-x-1 ${!detection.hasTactilePath && 'line-through text-neutral-700'}`}>
                <FaRoadCircleXmark size={20}/>No tactile paths for the visually impaired
              </li>
            </ul>
            </div>
          </div>
        ) : (
          <div>No detections found.</div>
        )}
      </div>
    )
  }

  return (
    <div>
    <Modal 
        isOpen={isOpen}
        onClose={toggleModal}
        onSubmit={onSubmit}
        title="Deteksi kualitas trotoar"
        body={bodyContent}
        submitLabel={submitLabel}
    />
    <ToastContainer />
    </div>
  )
}

export default AnalyzeModal