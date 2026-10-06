import React from 'react'
import First from '../assets/image.png'
import fou from '../assets/fou.avif'
import thi from '../assets/thi.avif'
import { Link } from 'react-router-dom'
import sec from '../assets/Sec.avif'
import  { useState } from "react";
import { useCart } from '../Component/Supplier'
import { Category ,button,products} from '../Component/Items'

import { X } from 'lucide-react'


const Contant = () => {
const {addToCart,cart, totalPrice,totalCount,count,setCount,setSelect, select,increase,decrease,search ,addToItem,setName } = useCart();   

 
   
  

  return (
    <>
    
 

    <div className=' relative max-w-7xl mx-auto  md:mt-25 mt-40'>
      <Link to="/Stock"> <img src={First} alt="" class="w-full " /></Link>
    </div>
   
      <div className='grid grid-cols-4 gap-4  px-3.5 pt-2.5 max-w-7xl mx-auto '>
       <Link to="/Medical"> <img src={sec} alt="" class="" /></Link>
     <Link to="/Petcare"><img src={thi} alt="" class="" /></Link> 
     <Link to="/Babycare"><img src={fou} alt="" class="" /></Link> 
      </div>
         <div className='grid grid-cols-5 md:grid-cols-10 max-w-7xl mx-auto'>
        {button.map ((item) => (
          <div key={item.name}>
           <Link to='/Cate' onClick={()=> setSelect(item.name)}> <img src={item.img} alt="" /></Link>
           
          </div>
        ))}

         </div>
           <div className=" p-6 max-w-7xl mx-auto">
      {Category.map((cat) => (
        <div key={cat.name} className="mb-10">
          <h2 className="text-2xl font-bold mb-4 pl-2">
            {cat.name} 
          </h2>
          <div
 
className='h-auto overflow-x-auto max-w-7xl mx-auto justify-center  scrollbar-none     flex items-center p-5'>

          <div className="flex gap-8 w-full ">
            {products
              .filter((item) => item.category=== cat.name)
              .map((item) => (
                 <div  className='bg-white h-63 rounded-xl p-2 w-40  shrink-0 shadow-md  hover:shadow-xl transition'>
           <Link to="/Multi" onClick={()=>addToItem(item)}> <img  className='w-full h-30 object-cover' src={item.img} alt="" /></Link>
       
      

    <div class="p-2">
      <h2 class="text-lg font-semibold truncate text-gray-800">
       {item.title}
      </h2>

      <p class="text-gray-500 text-sm mt-2">
       {item.weight}
      </p>
      

      <div class="flex justify-between items-center mt-2">
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
          onClick={()=> decrease(item.id)}
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
      ))}
      
    </div>
    
   
   
    </>
  )
}

export default Contant;