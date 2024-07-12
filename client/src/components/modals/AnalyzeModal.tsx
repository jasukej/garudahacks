import React, { CSSProperties, useCallback, useMemo, useState } from 'react'
import useAnalyzeModal from '../../hooks/useAnalyzeModal';
import Map, { Location } from '../Map';
import axios from 'axios';
import Modal from './Modal';
import { ToastContainer, toast } from 'react-toastify';
import BounceLoader from "react-spinners/BounceLoader"
import { Detection } from '../MapDisplay';

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
    
    return 'Close';
}, [step])


  const onSubmit = async () => {
    if (step === STEPS.DETECTIONS) {

      // add to firestore here instead

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
        console.log('sending to backend at ', url)
        setDetection(response.data.detections);
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
            <div>{detection.hasSidewalk ? 'Sidewalk present.' : 'No sidewalks along this road.'}</div>
            <div className="font-semibold text-md">key issues</div>
            <ul className="flex flex-col gap-y-1">
              <li>Obstacles: {detection.hasObstacles ? 'Yes' : 'No'}</li>
              <li>Cracks: {detection.hasCracks ? 'Yes' : 'No'}</li>
              <li>Unregulated Parking: {detection.hasParkedVehicles ? 'Yes' : 'No'}</li>
              <li>Unregulated Vendors: {detection.hasVendors ? 'Yes' : 'No'}</li>
              <li>Tactile Paths: {detection.hasTactilePath ? 'Yes' : 'No'}</li>
            </ul>
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