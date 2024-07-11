import React, { useState } from 'react'
import useAnalyzeModal from '../../hooks/useAnalyzeModal';
import Modal from 'react-modal';
import { Location } from '../Map';
import axios from 'axios';
import { MdClose } from 'react-icons/md';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../config/firebase';

const customStyles = {
  content: {
    height: '30vh',
    maxWidth: '690px',
    marginTop: '46%'
  },
}

interface Detection {
  label: string;
  confidence: number;
  box: number[];
}

interface AnalyzeModalProps {
  position: Location | null;
}

const AnalyzeModal = ({position}:AnalyzeModalProps) => {

  const { isOpen, toggleModal } = useAnalyzeModal();

  const [analysis, setAnalysis] = useState<Detection[] | null>(null);
  const [imageURL, setImageURL] = useState();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
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

  const saveAnalysis = async () => {
    if (position && imageURL) {
      await addDoc(collection(db, 'analyses'), {
        lat: position.lat,
        lng: position.lng,
        image_url: imageURL,
        analysis: analysis
      })
      toggleModal();
    }
  }

  return (
    <Modal 
      isOpen={isOpen}
      onRequestClose={toggleModal}
      contentLabel="Analyze Walkability"
      ariaHideApp={false}
      style={customStyles}
    >
      <div className="
        flex
        flex-col
        gap-y-4
        justify-center
        items-center
        relative
        h-full
      ">
        <div 
        onClick={toggleModal}
        className="
          absolute 
          top-1
          right-1
          cursor-pointer
        ">
          <MdClose size={20}/>
        </div>

        {loading ? (
          <div className="
            flex
            flex-col
            justify-center
            items-center
            gap-y-2
            mt-10
            mb-6
          ">
            <div className="text-md">
              Analyzing, please wait...
            </div>
            <div className="loader"></div> 
          </div>
        ) : analysis && imageURL ? (
          <div className="mt-4">
            <div className="
              flex
              flex-col
              gap-y-2
            ">
            <div className="text-md">Analisa selesai.</div>
                        <img src={imageURL} alt="Analyzed Image"/>
                        <div className="text-md">Detections:</div>
                        <ul>
                            {analysis.map((detection, index) => (
                                <li key={index}>
                                    {detection.label}: {detection.confidence.toFixed(2)}
                                </li>
                            ))}
                        </ul>
            </div>
            <div 
              onClick={saveAnalysis}
              className='
                mt-4
                bg-blue-500
                border
                border-blue-800
                px-4
                py-2
                text-slate-100
                rounded-md
                cursor-pointer
                hover:opacity-80
            '>
              Simpan analisa
            </div>
          </div>
        ) : (
          <div className="
            flex
            flex-col
            justify-center
            items-center
            gap-y-2
            mt-10
          ">
            <div className="text-md">
              Cek apakah daerah tersebut ramah pejalan?
            </div>
            {position &&
            <div className="text-gray-600 text-xs">
              Lokasi: [{position.lat}, {position.lng}]
            </div>}
            <div 
              onClick={handleSubmit}
              className='
                bg-red-500
                border
                border-orange-800
                px-4
                py-2
                text-slate-100
                rounded-md
                cursor-pointer
                hover:opacity-80
            '>
              Mulai
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}

export default AnalyzeModal