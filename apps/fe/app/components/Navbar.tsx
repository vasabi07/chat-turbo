import Image from 'next/image'
import React from 'react'
import PersonalInfo from './personalInfo'

const Navbar = () => {
  return (
    <div className='flex px-2 items-center justify-between bg-slate-200 h-16 border font-bold border-b-orange-950'>
        <div className='flex items-center gap-2 text-xl  '>
            <Image src="" alt='logo'/>
            I-Message
        </div>
        <div>
          <PersonalInfo/>
        </div>
        
    </div>
  )
}

export default Navbar