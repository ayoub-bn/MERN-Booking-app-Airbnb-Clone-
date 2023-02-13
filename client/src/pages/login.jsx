import { useContext, useState } from "react";
import { Link ,Navigate} from "react-router-dom";
import axios from "axios";
import { UserContext } from "../userContext";


export default function Login(){

    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('')
    const [redirect,setRedirect]=useState(false)
    const{setUser}= useContext(UserContext)

    async function login(ev)
    {
        ev.preventDefault()
        try {
            const {data} = await axios.post('/login',{email, password})
            setUser(data)
            setRedirect(true)
        } catch (error) {
            alert('login failed')
        }
    }


    if(redirect)
    return <Navigate to={'/'}/>

    return(
        <div className="mt-4 grow flex items-center justify-around">
            <div className="mb-64">
            <h1 className="text-4xl text-center mb-4">Login</h1>
            <form action="" className="max-w-lg mx-auto" onSubmit={login}>
                    <input type="text" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
                <button className="primary">Login</button>
                <div className="text-center py-4 text-gray-500">
                    Don't Have an Account Yet?, <Link className="underline text-black" to={"/register"}>Register Now</Link>
                </div>
            </form>
            </div>
           
        </div>
    )
}