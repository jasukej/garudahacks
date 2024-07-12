import React from 'react'
import useSummarizeModal from '../hooks/useSummarizeModal'

const LocationSummary = () => {

    const summarizeModal = useSummarizeModal();
  return (
    <div>
    <div 
    onClick={summarizeModal.toggleModal}
    className="
            mt-4
            mx-8
            text-white
            font-semibold
            bg-red-700
            py-2
            rounded-lg
        ">
            Buat ringkasan lokasi
    </div>
        <div>
            {/* Pull all  */}
        </div>
    </div>
  )
}

export default LocationSummary