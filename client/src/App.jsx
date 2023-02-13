import { Route, Routes } from 'react-router-dom'
import Index from './pages/index.jsx'
import './App.css'
import Login from './pages/login.jsx'
import Layout from './Layout.jsx'
import Register from './pages/register.jsx'
import axios from 'axios'
import { UserContextProvider } from './userContext.jsx'
import Account from './pages/account.jsx';
import Places from './pages/places';
import PlacesForm from './pages/placesContent/Form';
import PlacePage from './pages/PlacePage';
import BookingsPage from './pages/bookingsPage';
import BookingPage from './pages/bookingPage';

function App() {
  axios.defaults.baseURL = "http://localhost:4000"
  axios.defaults.withCredentials = true


  
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/account/" element={<Account />} />
          <Route path="/account/places" element={<Places />} />
          <Route path="/account/places/new" element={<PlacesForm />} />
          <Route path="/account/places/:id" element={<PlacesForm />} />
          <Route path="/place/:id" element={<PlacePage />} />
          <Route path="/account/bookings" element={<BookingsPage />} />
          <Route path="/account/bookings/:id" element={<BookingPage />} />

        </Route> 
      </Routes >
    </UserContextProvider>






  )
}

export default App
