const Footer = () => {
    return (
      <footer className="
        p-4 
        z-10
        bg-neutral-800 
        w-full 
        text-center 
        font-light
        text-neutral-200">
        <div>Dibuat di <span className="font-semibold cursor-pointer hover:text-red-600">GarudaHacks 2024</span> |&nbsp;
        <a
            href=""
            className="
              inline-flex
              items-center
              group
              hover:underline-offset-2
              hover:text-red-800
              "
          >
            Beri masukan 
        <span className="
          ml-2 
          mt-[1px]
          transition-transform 
          transform 
          group-hover:translate-x-1">
          →
        </span>
        </a>
        </div>
      </footer>
    )
  }
  
  export default Footer