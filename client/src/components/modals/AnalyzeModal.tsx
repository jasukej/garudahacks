import React, { useCallback, useMemo, useState } from 'react'
import useAnalyzeModal from '../../hooks/useAnalyzeModal';
import Map, { Location } from '../Map';
import axios from 'axios';
import { MdClose } from 'react-icons/md';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../config/firebase';
import Modal from './Modal';
import { ToastContainer } from 'react-toastify';

const defaultPosition:Location = {
  lat: -6.21154400,
  lng: 106.84517200
}

interface Detection {
  label: string;
  confidence: number;
  box: number[];
}

enum STEPS {
  LOCATION_SELECT = 0,
  DETECTIONS = 1,
}

const AnalyzeModal = () => {
  const [position, setPosition] = useState<Location>(defaultPosition);
  const { isOpen, toggleModal } = useAnalyzeModal();
  const [analysis, setAnalysis] = useState<Detection[] | null>(null);
  const [imageURL, setImageURL] = useState();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);

  const onNext = useCallback(() => {
    setStep((prev) => prev + 1)
  }, [])

const submitLabel = useMemo(() => {
    if (step == STEPS.LOCATION_SELECT) {
        return 'Detect sidewalk quality';
    }
    
    return 'Next';
}, [step])


  const onSubmit = async () => {
    console.log(position)
    if (position) {
      setLoading(true);
      try {
        const url = `http://localhost:8080/analyze?lat=${position.lat}&lng=${position.lng}`
        const response = await axios.get(url);
        console.log('sending to backend at ', url)
        setAnalysis(response.data.detections);
      } catch (error) {
        console.log('Scan failed', error);
        // !!! replace with toast
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