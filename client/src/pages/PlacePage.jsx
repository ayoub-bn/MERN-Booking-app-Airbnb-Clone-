import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import BookingWidget from './bookingWidget';
import PlaceGallery from './placeGallery';
import PlaceAddressLink from './placeAddressLink';



export default function PlacePage() {

    const [place, setPlace] = useState(null)
    const { id } = useParams()


    useEffect(() => {
        if (!id) return
        axios.get('/places/' + id)
            .then(res => {
                setPlace(res.data)
            })
    }, [id])

    if (!place) return ''
    

    return (
        <div className='mt-4 bg-gray-100 -mx-8 px-8 pt-8'>
            <h1 className='text-3xl'>{place.title}</h1>
            
            <PlaceAddressLink>{place.address}</PlaceAddressLink>
            
            <PlaceGallery place={place} />

            <div className='mt-8 mb-8 gap-8 grid grid-cols-[2fr_1fr]'>
                <div>
                    <div className='my-4'>
                        <h2 className='font-semibold text-2xl'>Description</h2>
                        {place.description}
                    </div>
                    Check-in: {place.checkIn}<br />
                    Check-out: {place.checkOut}<br />
                    Max number of guests: {place.maxGuests}
                </div>
                <div>
                    <BookingWidget place={place} />
                </div>
            </div>
            <div className="bg-white -mx-8 px-8 py-8 border-t">
            <div>
                <h2 className='font-semibold text-2xl'>Extra Info!</h2>
            </div>
            <div className='mb-4 mt-2 text-sm text-gray-700 leading-5'>
                {place.extraInfo}
            </div>
            </div>
           

        </div>
    )
}