"use client"
import React, { useState } from 'react'
import axios from 'axios'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
const Signup = () => {
    const {toast}  = useToast()
    const router = useRouter()
    const [data,setData] = useState({
        name: "",
        phone: "",
        password: ""
    })
    const HandleChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
        setData({...data, [e.target.name]:e.target.value})
    }
    const HandleSubmit =async (e: React.FormEvent)=>{
        e.preventDefault();
        try {
            const response =await axios.post("http://localhost:8000/signup",data);
            if (response.status === 201) {
                toast({
                  title: "Success",
                  description: "User created succesfully!. Go ahead and signin!",
                  className: "bg-black text-stone-200 p-2 m-2  "
                });
              }
              router.push("/signin");
            console.log(response);
        } catch (error) {
            console.log(error)
        }
    }
  return (
    <div className='flex w-full h-screen justify-center items-center text-white'>
        <div className='flex p-2  w-[300px] h-[320px] flex-col border-2 '>
        <h1 className='text-4xl text-black'>Signup</h1>
        <form className='flex flex-col justify-between p-2 gap-2'   onSubmit={HandleSubmit}>
            <input className='py-2 border-b-2 outline-none focus: ring-0 focus:border-slate-600  ' name='name' value={data.name} type="text" placeholder='Name' onChange={HandleChange} />
            <input className='py-2 border-b-2 outline-none focus: ring-0 focus:border-slate-600 ' name='phone' value={data.phone} type="phone" placeholder='Phone' onChange={HandleChange} />
            <input className='py-2 border-b-2 outline-none focus: ring-0 focus:border-slate-600 ' name='password' value={data.password} type="text" placeholder='Password' onChange={HandleChange} />
            <button className='px-4 py-2 bg-slate-600 text-white' type='submit' >Submit</button>
        </form>
        </div>
    </div>
  )
}

export default Signup;