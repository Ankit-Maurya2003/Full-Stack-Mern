import React from 'react'
import Navbar from './Component/Navbar';
import Footer from './Component/Footer';
import Contant from './pages/Contant';
import { Routes, Route } from "react-router-dom";
import { useState } from 'react'
import Stock from './pages/Stock';
import ScrollBar from './Component/ScrollBar';
import Payment from './pages/Payment';
import { CartProvider,useCart  } from './Component/Supplier';
import Medical from './pages/Medical';
import Petcare from './pages/Petcare';
import Babycare from './pages/Babycare';
import Multi from './pages/Multi';
import Loop from './pages/Loop'
import Cate from './pages/Cate';
import FindCart from './pages/FindCart';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MyOrders from './pages/MyOrders.jsx';


const AppContent = () => {
  const { visible,myCart ,token } = useCart();

  return (
    <>
    {token?
    (
      <div>
        
    
<Navbar />

      <div
        className={`transition-all duration-300 ${
          visible || myCart ? "blur-lg" : ""
        }`}
      >
        <ScrollBar />

        <Routes>
          <Route path="/" element={<Contant />} />
          <Route path="/Pay" element={<Payment />} />
          <Route path="/Stock" element={<Stock />} />
          <Route path="/Medical" element={<Medical />} />
          <Route path="/Petcare" element={<Petcare />} />
          <Route path="/Babycare" element={<Babycare />} />
          <Route path="/Multi" element={<Multi />} />
          <Route path="/Loop" element={<Loop />} />
          <Route path="/Cate" element={<Cate />} />
           <Route path="/FindCart" element={<FindCart />} />
              <Route path="/Login" element={<Login />} />
              <Route path="/Signup" element={<Signup />} />
            <Route path="/MyOrders" element={<MyOrders/>} />

        </Routes>
       <Footer />
        
      </div>
 
      </div>
    ):
    (
      <div>
         <Routes>
              <Route path="/" element={<Signup />} />
              <Route path="/Login" element={<Login />} />
              <Route path="/MyOrders" element={<MyOrders/>} />
          

        </Routes>
      </div>

    )
  }


      
    </>
    
  );
};

const App = () => {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
};

export default App
