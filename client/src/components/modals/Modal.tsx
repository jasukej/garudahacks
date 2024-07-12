import React, { useEffect, useState } from 'react'
import { MdClose } from 'react-icons/md';

interface ModalProps {
    isOpen?: boolean,
    onClose: () => void;
    onSubmit: () => void;
    title?: string;
    body?: React.ReactElement;
    submitLabel: string;
}

const Modal = ({
    isOpen,
    onClose,
    onSubmit,
    title,
    body,
    submitLabel
}:ModalProps) => {

    const [showModal, setShowModal] = useState(isOpen);

    useEffect(() => {
        setShowModal(isOpen)
    }, [isOpen])

    if (!isOpen) {
        return null;
    }

  return (
    <div>
    <div 
    className="
        justify-center
        items-center
        flex
        overflow-x-hidden
        overflow-y-auto
        fixed
        inset-0
        z-50
        outline-none
        focus:outline-none
        bg-neutral-800/70
    ">
        <div
        className="
            relative
            w-full
            md:w-4/6
            lg:w-3/6
            xl:w-2/5
            my-6
            mx-auto
            h-full
            lg:h-auto
            md:h-auto
        ">
            <div
            className={`
                translate
                duration-300
                h-full
                ${showModal ? 'translate-y-0' : 'translate-y-full'}
                ${showModal ? 'opacity-100' : 'opacity-0'}
            `}>
                <div
                className="
                    translate
                    h-full
                    lg:h-auto
                    md:h-auto
                    relative
                    rounded-t-lg
                    md:rounded-lg
                    shadow-lg
                    border-0
                    flex
                    flex-col
                    w-full
                    bg-white
                    outline-none
                    focus:outline-none
                ">
                    <div
                    className="
                    flex
                    items-center
                    p-6
                    rounded-t
                    justify-center
                    relative
                    border-b-[1px]
                    ">
                        <button
                        onClick={onClose}
                        className="
                            p-1
                            border-0
                            hover:opacity-70
                            transition
                            absolute
                            left-9
                        ">
                            <MdClose 
                            className="text-gray-800 sm"/>
                        </button>
                        <div 
                        className="
                        text-lg
                        font-semibold"
                        >
                            {title}
                        </div>
                    </div>

                    <div className="relative p-6 flex-auto">
                        {body}
                    </div>

                    <div 
                    className="
                        flex
                        flex-row
                        gap-4
                        w-full
                        items-center
                    ">
                        <button
                            onClick={onSubmit}
                            className="
                                hover:opacity-80
                                flex
                                justify-center
                                bg-red-700
                                rounded-md
                                text-white
                                font-semibold
                                w-full
                                py-2
                                mx-4
                                mb-4
                            "
                        >
                            {submitLabel}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </div>
  )
}

export default Modal