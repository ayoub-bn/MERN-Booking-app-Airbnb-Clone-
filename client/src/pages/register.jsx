import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function Register() {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    async function register(ev)
    {
        ev.preventDefault()
        try {
            await axios.post('/register',
        {
            name,
            email,
            password
        })
       alert('Registration Successful')
        } catch (error) {
            alert("email already exist")
        }
    }

    return (
        <div className="mt-4 grow flex items-center justify-around">
            <div className="mb-64">
                <h1 className="text-4xl text-center mb-4">Register</h1>
                <form action="" className="max-w-lg mx-auto" onSubmit={register}>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
                    <input type="text" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
                    <button className="primary">Login</button>
                    <div className="text-center py-4 text-gray-500">
                        Already A Member?, <Link className="underline text-black" to={"/login"}>Login</Link>
                    </div>
                </form>
            </div>

        </div>
    )
}