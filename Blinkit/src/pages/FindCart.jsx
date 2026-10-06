import React from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../Component/Supplier';
import { useState } from 'react';
import { product,productive,products,petProducts,babyProducts,buttonProducts } from '../Component/Items';


const FindCart = () => {
    const { cart,totalCount,item,search,addToCart,addToItem,setSearch,setVisible,count,increase,decrease, totalPrice, visible ,setName,name,setMyCart,myCart } = useCart();
    
   const allProducts = [
  ...products,
  ...product,
  ...productive,
  ...petProducts,
  ...babyProducts,
  ...buttonProducts,
];
const filteredProducts = allProducts.filter((item) =>
  item.title?.toLowerCase().includes(search.trim().toLowerCase())
);

  return (
    <>
    <div className='mt-30   h-screen z-500'>
          {
      search ? (
        <div className='inset-0 fixed h-auto z-150 md:mt-20 mt-40 bg-white scrollbar-none overflow-y-scroll '>
                 
                  <div className='pl-12 md:pl-4 lg:pl-3 xl:pl-12' >
                  <div class=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  mt-5   lg:grid-cols-4 xl:grid-cols-5 gap-8">
                        {filteredProducts
                            .map((item) => (
                               <div key ={item.id} className='bg-white rounded-xl w-55  shrink-0 shadow-md overflow-hidden hover:shadow-xl transition'>
                     
                    
                   <Link to="/Multi" > <img onClick={()=>addToItem(item) }className='w-full h-52 object-cover' src={item.img} alt="" /></Link>
              
                  <div class="p-4">
                    <h2 class="text-lg font-semibold truncate text-gray-800">
                     {item.title}
                    </h2>
              
                    <p class="text-gray-500 text-sm mt-2">
                     {item.weight}
                    </p>
                    
              
                    <div class="flex justify-between items-center mt-4">
                      <span class="text-xl font-bold text-green-600">
                        {item.mrp}
                      </span>
                     {
                       !count[item.id] ? (<button
                      onClick={()=> {increase(item.id), addToCart(item)}}
                     
                      class="border border-green-400 text-green-600 bg-green-50 px-4 py-2 rounded-lg">
                        Add
                      </button>)
                      : (<button
                      
                      class="border border-green-400 flex justify-around items-center text-green-800 bg-green-300 h-10 w-20 rounded-xl">
                        <div
                        onClick={()=> 
                    { decrease(item.id)}}
                        className='text-xl'>-</div>
                        <div className='text-xl'>{count[item.id] || 0}</div>
                        <div
                        onClick={()=> increase(item.id)}
                        className='text-xl'>+</div>
                      </button>
                    )
                    
                     }
                      
                    </div>
                  </div>
                   
                  </div>
                              
                            ))}
                            
              
                  </div>
          
                  </div>
                 
                
        </div>
      )
      :
      (
        <div className='h-full w-full flex justify-center text-gray-400 text-4xl font-bold'>No Search</div>
      )

     }

    </div>
      
    </>
  )
}

export default FindCart
