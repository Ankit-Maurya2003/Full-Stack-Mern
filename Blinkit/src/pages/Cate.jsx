import React from 'react'
import { button, buttonProducts } from '../Component/Items'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useCart } from '../Component/Supplier'

const Cate = () => {

  const { addToCart, count, setCount, increase, decrease, addToItem, setSelect, select } = useCart();

  const Items = buttonProducts.filter((item) => !select || item.category === select)

  return (
    <>
      <div className='grid grid-cols-10 md:mt-35 lg:mt-25 mt-40 max-w-7xl mx-auto h-auto'>

        {/* Category Name */}
        <div className='col-span-10 border font-bold p-2'>
          {select}
        </div>


        {/* CATEGORY */}

        <div className='col-span-10 sm:col-span-3 md:col-span-1 
                        flex sm:grid sm:grid-cols-1 
                        gap-2 
                        overflow-x-auto sm:overflow-x-hidden 
                        sm:overflow-y-auto 
                        h-auto sm:h-130 
                        border p-2'>

          {button.map((cat) => (

            <div
              key={cat.name}
              className='text-center flex-shrink-0 w-20 sm:w-full'
            >

              <div
                className='w-full cursor-pointer'
                onClick={() => setSelect(cat.name)}
              >

                <img
                  src={cat.img}
                  className='w-full object-contain'
                  alt=""
                />

              </div>

            </div>

          ))}

        </div>


        {/* PRODUCTS */}

        <div className='col-span-10 sm:col-span-7 md:col-span-9 
                        grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 
                        gap-2 sm:gap-4 
                        overflow-y-auto 
                        h-auto sm:h-130 
                        border 
                        p-1 sm:p-0'>

          {Items.map((item) => (

            <div
              className='p-1 sm:p-3'
              key={item.id}
            >

              <div className='p-2 border rounded-lg h-full'>

                <Link
                  to="/Multi"
                  onClick={() => addToItem(item)}
                >

                  <img
                    src={item.img}
                    className='w-full h-32 sm:h-auto object-contain'
                    alt=""
                  />

                </Link>


                <p className='pt-2.5 truncate text-sm sm:text-base'>
                  {item.title}
                </p>

                <span className='text-gray-400 text-xs sm:text-sm'>
                  {item.weight}
                </span>

                <br />


                <span className='text-blue-800 flex justify-between items-center gap-1'>

                  <span className='text-sm sm:text-base'>
                    ₹{item.mrp}
                  </span>


                  {
                    !count[item.id]

                      ?

                      (

                        <button
                          onClick={() => {
                            increase(item.id),
                            addToCart(item)
                          }}

                          className='border border-green-400 
                                     text-green-600 
                                     bg-green-50 
                                     px-3 sm:px-4 
                                     py-1.5 sm:py-2 
                                     rounded-lg 
                                     text-sm'
                        >
                          Add
                        </button>

                      )

                      :

                      (

                        <button

                          className='border border-green-400 
                                     flex justify-around items-center 
                                     text-green-800 
                                     bg-green-300 
                                     h-9 sm:h-10 
                                     w-18 sm:w-20 
                                     rounded-xl'
                        >

                          <div
                            onClick={() => decrease(item.id)}
                            className='text-lg sm:text-xl cursor-pointer'
                          >
                            -
                          </div>

                          <div className='text-lg sm:text-xl'>
                            {count[item.id] || 0}
                          </div>

                          <div
                            onClick={() => increase(item.id)}
                            className='text-lg sm:text-xl cursor-pointer'
                          >
                            +
                          </div>

                        </button>

                      )
                  }

                </span>

              </div>

            </div>

          ))}

        </div>

      </div>
    </>
  )
}

export default Cate