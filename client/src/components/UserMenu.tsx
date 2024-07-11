import React, { useCallback, useState } from 'react'
import { useLoginModal } from '../hooks/useLoginModal';
import Avatar from './Avatar';
import { MdSettings } from 'react-icons/md';

interface UserMenuProps {
    currentUser?: any | null
}

const UserMenu = ({ currentUser }:UserMenuProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const loginModal = useLoginModal();

    const onAdd = useCallback(() => {
        if(!currentUser) {
            return loginModal.toggleModal
        }
    }, [isOpen, loginModal])

    const toggleOpen = useCallback(() => {
        setIsOpen(prev => !prev)
    }, [isOpen])

  return (
    <div>
        <div 
        onClick={toggleOpen}
        className="
            relative
            p-1
            bg-white
            border-black
            rounded-full
            flex
            flex-row
            gap-x-2
            items-center
        ">
            <MdSettings size={27} />
            <Avatar 
                src={currentUser?.image}
            />
        </div>

        {isOpen && (
            <div
                className="
                    absolute
                    rounded-xl
                    bg-white
                    text-sm
                    w-[20vw]
                    top-[70px]
                    right-3
                    shadow-md
                "
            >
                <div className="
                    flex
                    flex-col
                    cursor-pointer
                    justify-start
                    items-start
                ">
                    {currentUser ? (
                    <>
                    <div className="
                        text-black 
                        font-semibold
                        px-4
                        py-3
                        rounded-t-xl
                        transition
                        hover:bg-neutral-200
                    ">
                        Profil
                    </div>
                    <div className="
                        text-black 
                        font-semibold
                        px-4
                        py-3
                        transitiion
                        hover:bg-neutral-200
                    ">
                        Laporan
                    </div>
                    <div className="
                        text-black 
                        font-semibold
                        px-4
                        py-3
                        rounded-b-xl
                        transitiion
                        hover:bg-neutral-200
                    ">
                        Log out
                    </div>  
                    </>       
                ) : (
                    <>
                        <div className="
                        text-black 
                        font-semibold
                        px-4
                        py-3
                        rounded-t-xl
                        transition
                        hover:bg-neutral-200
                    ">
                        Lapor isu
                    </div>
                    <div className="
                        text-black 
                        font-semibold
                        px-4
                        py-3
                        rounded-b-xl
                        transitiion
                        hover:bg-neutral-200
                    ">
                        Log in
                    </div>
                    </>
                )}
             </div>
            </div>
        )}
    </div>
  )
}

export default UserMenu