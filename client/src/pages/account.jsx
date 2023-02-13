
import { useContext } from 'react';
import { Navigate, Link, useParams } from 'react-router-dom';
import { UserContext } from '../userContext.jsx';
import axios from "axios";
import { useState } from 'react';
import Places from './places.jsx';
import AccountNavBar from './accountNavBar';



export default function Account() {

    const [redirect, setRedirect] = useState(null)
    const { ready, user, setUser } = useContext(UserContext)

    let { subpage } = useParams()
    if (subpage === undefined)
        subpage = 'profile'

    if (!ready)
        return "Loading ..."


    if (ready && !user && !redirect)
        return <Navigate to='/login' />


    async function logout() {
        await axios.post('/logout')
        setRedirect('/')
        setUser(null)
    }

    if (redirect)
        return <Navigate to={redirect} />



    return (
        <div>
            <AccountNavBar/>
            {subpage === 'profile' && (
                <div className='text-center max-w-lg mx-auto'>
                    Logged in as {user.name} ({user.email})<br />
                    <button onClick={logout} className='primary max-w-sm mt-2'>Logout</button>
                </div>
            )}
            {subpage === 'places' && (<Places />)}
        </div>
    )

}



