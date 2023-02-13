import { useState } from 'react'
import { Navigate, useParams } from 'react-router-dom';
import PhotosUplaoder from '../../photosUploader';
import AccountNavBar from '../accountNavBar';
import Perks from './perks';
import axios from 'axios';
import { useEffect } from 'react';


export default function PlacesForm()
{
    const {id}=useParams()

    const [title, setTitle] = useState('')
    const [address, setAddress] = useState('')
    const [addedPhotos, setAddedPhotos] = useState([])
    const [description, setDescription] = useState('')
    const [perks, setPerks] = useState([])
    const [extraInfo, setExtraInfo] = useState('')
    const [checkIn, setCheckIn] = useState('')
    const [checkOut, setCheckOut] = useState('')
    const [maxGuests, setMaxGuests] = useState('')
    const [price,setPrice]=useState(100)
    const [redirect,setRedirect]=useState(false)

    useEffect(()=>{
        if(!id)
            return
        
        axios.get('/places/'+id)
            .then(res=>{
                const {data}=res
                setTitle(data.title)
                setAddress(data.address)
                setAddedPhotos(data.photos)
                setDescription(data.description)
                setPerks(data.perks)
                setExtraInfo(data.extraInfo)
                setCheckIn(data.checkIn)
                setCheckOut(data.checkOut)
                setMaxGuests(data.maxGuests)
                setPrice(data.price)
            })

    },[id])


    function inputHeader(text) {
        return <h2 className='text-2xl mt-4'>{text}</h2>
    }

    function inputDescription(text) {
        return <p className='text-gray-500 text-sm'>{text}</p>
    }

    function preInput(header, description) {
        return (
            <>
                {inputHeader(header)}
                {inputDescription(description)}

            </>
        )
    }

    async function savePlace(e)
    {
        e.preventDefault()
        const placeData={title,address,addedPhotos,description,perks,extraInfo,checkIn,checkOut,maxGuests,price}
        if(id)
        {
            // update Place
            await axios.put('/updatePlace',{id,...placeData})
            setRedirect(true)
        }
        else
        {
            // new Place
            await axios.post('/newPlace',{...placeData})
            setRedirect(true)
        }

    }

    if(redirect)
    return <Navigate to={'/account/places'}/>


    return (
        <>
        <div>
            <AccountNavBar/>
                    <form action="" onSubmit={savePlace}>
                        {preInput('title', 'Title for your Place, Should be short and appealing')}

                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder='Title, exp: My Lovely Apt' />
                        {preInput('Address', 'Address to this place')}


                        <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address" />
                        {preInput('Photos', 'More = Better')}
                        <PhotosUplaoder addedPhotos={addedPhotos} onChange={setAddedPhotos} />
                        {preInput('Description', 'Description of the Placxe')}

                        <textarea rows="7" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                        {preInput('Perks', 'Select all the perks of your place')}


                        <div className='grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6 mt-2'>
                            <Perks selected={perks} onChange={setPerks} />
                        </div>

                        {preInput('Extra Info', 'House rules, etc...')}

                        <textarea rows="4" value={extraInfo} onChange={(e) => setExtraInfo(e.target.value)}></textarea>

                        {preInput('Check In & Check Out times', 'Add check in and checkout times, Remember to have some time window for cleaning the room between guests')}

                        <div className='grid gap-3 grid-cols-2 md:grid-cols-4'>
                            <div>
                                <h3 className='mt-2 -mb-1'>Check In Time</h3>
                                <input type="text" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} placeholder="14" />
                            </div>
                            <div>
                                <h3 className='mt-2 -mb-1'>Check Out Time</h3>
                                <input type="text" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} placeholder="11" />
                            </div>
                            <div>
                                <h3 className='mt-2 -mb-1'>Max Number of Guests</h3>
                                <input type="number" value={maxGuests} onChange={(e) => setMaxGuests(e.target.value)} placeholder="4" />
                            </div>
                            <div>
                                <h3 className='mt-2 -mb-1'>Price Per Night</h3>
                                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="4" />
                            </div>
                            <button className="primary my-4">Save</button>
                        </div>

                    </form>
                </div></>
    )
}