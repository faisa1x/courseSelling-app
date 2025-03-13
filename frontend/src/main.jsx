import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom"

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe("pk_test_51QytZfQGVPXSFhKbKpM1ZhNLUS4qA6IKfX3kxAmoHbFWMojNM0pQaybKNMxuzeXUIvacafwwozjhSiNkOk1WG0Sr00L8MR5zgw");



createRoot(document.getElementById('root')).render(
 


 <Elements stripe={stripePromise}>
 <BrowserRouter>
<App />
</BrowserRouter>
</Elements>
  
  
)
