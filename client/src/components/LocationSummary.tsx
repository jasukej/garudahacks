import React from 'react'
import useSummarizeModal from '../hooks/useSummarizeModal'
import { MdCameraAlt } from 'react-icons/md';
import { FaWalking } from 'react-icons/fa';
import useAnalyzeModal from '../hooks/useAnalyzeModal';

const LocationSummary = () => {

    const summarizeModal = useSummarizeModal();
    const analyzeModal = useAnalyzeModal();
  return (
    <div className="mt-4 flex-col mx-8">
        <div className="font-bold text-start text-2xl">
            Peta interaktif
        </div>
        <div className="font-light text-start">
            Tekan penanda di peta untuk mempelajari lebih lanjut.
        </div>
    <div 
    onClick={summarizeModal.toggleModal}
    className="
            mt-4
            text-white
            font-semibold
            bg-red-700
            py-2
            rounded-lg
        ">
            Buat ringkasan lokasi
    </div>
        <div className="mt-3">
        <div className="flex items-center mb-3 w-full">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-2 text-gray-500 text-sm ">atau coba sendiri</span>
            <div className="flex-grow border-t border-gray-300"></div>
        </div>
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
            onClick={analyzeModal.toggleModal}
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
              Deteksi keramahan pejalan
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
              Scan dengan camera
            </div>
          </div>
        </div>
    </div>
  )
}

export default LocationSummary