import React from 'react'
import UserMenu from './UserMenu'

const Navbar = () => {
  return (
    <div className="
        fixed
        w-full 
        bg-[#D63924]
        z-20
        shadow-md
    ">
        <div className="
            flex
            flex-row
            justify-between
            items-center
            px-4
            py-3
        ">
            <img 
                src="/src/assets/jalankami.png"
                alt="logo"
                style={{ height: '60px', width: '95px'}}
            />
            <UserMenu />
        </div>
    </div>
  )
}

export default Navbar