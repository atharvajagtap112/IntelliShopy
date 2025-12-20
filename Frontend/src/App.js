import logo from './logo.svg';
import './App.css';import HomePage from './customer/Pages/HomePage/HomePage';
import Navigation from './customer/components/Navigations/navigation';
import Product from './customer/components/Product/Product';
import ProductDetails from './customer/components/ProrductDetails/productsDetails';
import CartCard from './customer/components/Card/card';
import Checkout from './customer/components/Checkout/Checkout';
import Order from './customer/components/Order/Order';
import Footer from './customer/components/Footer/Footer';
import OrderDetails from './customer/components/Order/OrderDetails';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import CustomerRouters from './Routers/CustomerRouters';
import ScrollToTop from './customer/components/ScrollToTop';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
  <div className="App">
    
        <ScrollToTop /> {/* 👈 Add this here */}
        
        <Routes>
          <Route path="/*" element={<CustomerRouters />} />
        </Routes>
        <ToastContainer
         position="top-right" autoClose={3000} />
    </div>
   
   
   
  );
}

export default App;   
