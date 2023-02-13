
import { useState } from 'react';
import {differenceInCalendarDays} from 'date-fns'
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from './../userContext';
import { useEffect } from 'react';

export default function BookingWidget({ place }) {

    const [checkIn,setCheckIn] = useState('2023-06-06')
    const [checkOut,setCheckOut] = useState('2023-08-08')
    const [numberOfGuests,setNumberOfGuests]= useState(1)
    const [name,setName]=useState('John Doe')
    const [mobile,setMobile]=useState('12121212')
    const [redirect,setRedirect]=useState('')
    const {user} = useContext(UserContext)

    useEffect(()=>{
        setName(user.name)
    },[user])


    let numberOfNights=0

    if(checkIn && checkOut)
    {
        numberOfNights=differenceInCalendarDays(new Date(checkOut),new Date(checkIn))
    }

    async function bookThisPlace()
    {
        const response= await axios.post('/bookings',{place:place._id,checkIn, checkOut,numberOfGuests,name,phone:mobile,price:numberOfNights * place.price})
        const bookingId=response.data._id
        console.log(response.data)
        setRedirect(`/account/bookings/${bookingId}`)
    }

    if(redirect)
    return <Navigate to={redirect}/>

    return (
        <div className="bg-white shadow p-4 rounded-2xl">
            <div className="text-center text-2xl">
                Price: ${place.price} / per night
            </div>
            <div className="grid grid-cols-1 border rounded-2xl mt-4">
                <div className="flex grid grid-cols-[1fr_1fr]">
                    <div className=' py-4 px-4  '>
                        <label>Check In : <br /></label>
                        <input type="date" value={checkIn} onChange={e=>setCheckIn(e.target.value)} name="" id="" />
                    </div>
                    <div className='py-4 px-4 border-l '>
                        <label>Check Out : <br /></label>
                        <input type="date"value={checkOut} onChange={e=>setCheckOut(e.target.value)} name="" id="" />
                    </div>
                </div>
                <div>
                    <div className='py-4 px-4 border-t '>
                        <label>Number of guests:</label>
                        <input value={numberOfGuests} onChange={e=>setNumberOfGuests(e.target.value)} type="number" />
                    </div>
                </div>
            </div>
            {numberOfNights>0 && (
               <div className='py-4 px-4 border-t '>
                        <label>Full Name :</label>
                        <input type="text" value={name} onChange={e=>setName(e.target.value)} placeholder="Your Name" />

                        <label>Phone Number :</label>
                        <input type="tel" value={mobile} onChange={e=>setMobile(e.target.value)} placeholder="Your Name" />
                    </div>
            )}
            <button onClick={bookThisPlace} className='primary mt-4'>
                Book this place &nbsp;
                {numberOfNights>0 && (
                    <>
                        <span> ${numberOfNights * place.price}</span>
                    </>
                )}    
            </button>
        </div>
    )
}