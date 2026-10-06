import React from 'react'
import { useCart } from '../Component/Supplier'
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { product,productive,products,petProducts,babyProducts,buttonProducts } from '../Component/Items';

const Loop = () => {

  const{item,totalPrice,totalCount,count, addToItem ,addToCart ,setCount,increase,decrease, removeItem}= useCart();

  const allProducts = [
    ...products,
    ...product,
    ...productive,
    ...petProducts,
    ...babyProducts,
    ...buttonProducts,
  ];

  const filterAll = allProducts.filter((items) =>
    items.category===item.category
  );

  return (
    <>

      {/* BACK BUTTON */}

      <Link to='/' onClick={()=>removeItem()}>

        <div className='
          sm:mt-30
          mt-40
          ml-4 sm:ml-6 md:ml-10
          bg-gray-400
          w-10 h-10
          rounded-full
          flex items-center justify-center
        '>

          <ArrowLeft size={30}/>

        </div>

      </Link>


      {/* MAIN PRODUCT */}

      <div className='
        w-full
        mt-5 sm:mt-8 md:mt-10
        px-3 sm:px-5 md:px-8 lg:px-12
      '>

        <div
          key={item.id}
          className='
            bg-white
            grid grid-cols-1 md:grid-cols-2
            rounded-xl
            overflow-hidden
            border
            shadow-sm
          '
        >


          {/* PRODUCT IMAGE */}

          <div className='
            w-full
            flex items-center justify-center
            bg-gray-50
            p-4 sm:p-6
          '>

            <img
              src={item.img}
              alt="Product"
              className='
                w-full
                h-72
                sm:h-100
                md:h-125
                lg:h-150
                object-contain
              '
            />

          </div>


          {/* PRODUCT DETAILS */}

          <div className='
            p-4
            sm:p-6
            md:p-8
            lg:p-10
          '>

            <h2 className='
              text-xl
              sm:text-2xl
              md:text-3xl
              font-bold
              truncate
              text-gray-800
            '>
              {item.title}
            </h2>


            <p className='
              text-gray-500
              text-base
              sm:text-lg
              md:text-xl
              mt-2
            '>
              {item.weight}
            </p>


            {/* PRICE + ADD BUTTON */}

            <div className='
              flex
              justify-between
              items-center
              gap-3
              mt-6
            '>

              <span className='
                text-xl
                sm:text-2xl
                font-bold
                text-green-600
              '>

                ₹{item.mrp}

                <br />

                <span className='
                  text-xs
                  sm:text-sm
                  text-gray-400
                  font-normal
                '>
                  Inclusive of all taxes
                </span>

              </span>


              {
                !count[item.id]

                ?

                (

                  <button
                    onClick={()=> {
                      increase(item.id),
                      addToCart(item)
                    }}

                    className='
                      border border-green-400
                      text-white
                      bg-green-800
                      h-10
                      sm:h-12
                      md:h-14
                      w-24
                      sm:w-32
                      md:w-40
                      rounded-lg
                      text-sm
                      sm:text-base
                      md:text-lg
                      font-semibold
                    '
                  >
                    Add
                  </button>

                )

                :

                (

                  <button
                    className='
                      border border-green-400
                      flex justify-around items-center
                      text-white
                      bg-green-800
                      h-10
                      sm:h-12
                      md:h-14
                      w-24
                      sm:w-32
                      md:w-40
                      rounded-xl
                    '
                  >

                    <div
                      onClick={()=> decrease(item.id)}
                      className='
                        text-xl
                        sm:text-2xl
                        cursor-pointer
                      '
                    >
                      -
                    </div>

                    <div className='
                      text-xl
                      sm:text-2xl
                    '>
                      {count[item.id] || 0}
                    </div>

                    <div
                      onClick={()=> increase(item.id)}
                      className='
                        text-xl
                        sm:text-2xl
                        cursor-pointer
                      '
                    >
                      +
                    </div>

                  </button>

                )
              }

            </div>


            {/* WHY SHOP */}

            <div className='
              mt-8
              sm:mt-10
              pt-5
              border-t
              h-auto
            '>

              <h1 className='
                text-lg
                sm:text-xl
                font-bold
              '>
                Why shop from blinkit?
              </h1>


              {/* DELIVERY */}

              <div className='
                flex
                gap-3
                sm:gap-4
                pt-5
              '>

                <div className='shrink-0'>

                  <img
                    className='
                      w-14
                      sm:w-20
                      md:w-22
                    '
                    src="https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=90/assets/web/blinkit-promises/10_minute_delivery.png"
                    alt=""
                  />

                </div>

                <div>

                  <h4 className='
                    font-semibold
                    text-sm
                    sm:text-base
                  '>
                    Round The Clock Delivery
                  </h4>

                  <h1 className='
                    text-gray-600
                    text-xs
                    sm:text-sm
                    mt-1
                    leading-5
                  '>
                    Get items delivered to your doorstep from dark stores near you, whenever you need them.
                  </h1>

                </div>

              </div>


              {/* BEST PRICE */}

              <div className='
                flex
                gap-3
                sm:gap-4
                pt-5
              '>

                <div className='shrink-0'>

                  <img
                    className='
                      w-14
                      sm:w-20
                      md:w-22
                    '
                    src="https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=90/assets/web/blinkit-promises/Best_Prices_Offers.png"
                    alt=""
                  />

                </div>

                <div>

                  <h4 className='
                    font-semibold
                    text-sm
                    sm:text-base
                  '>
                    Best Prices & Offers
                  </h4>

                  <h1 className='
                    text-gray-600
                    text-xs
                    sm:text-sm
                    mt-1
                    leading-5
                  '>
                    Best price destination with offers directly from the manufacturers.
                  </h1>

                </div>

              </div>


              {/* WIDE ASSORTMENT */}

              <div className='
                flex
                gap-3
                sm:gap-4
                pt-5
              '>

                <div className='shrink-0'>

                  <img
                    className='
                      w-14
                      sm:w-20
                      md:w-22
                    '
                    src="https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=90/assets/web/blinkit-promises/Wide_Assortment.png"
                    alt=""
                  />

                </div>

                <div>

                  <h4 className='
                    font-semibold
                    text-sm
                    sm:text-base
                  '>
                    Wide Assortment
                  </h4>

                  <h1 className='
                    text-gray-600
                    text-xs
                    sm:text-sm
                    mt-1
                    leading-5
                  '>
                    Choose from 30,000+ products across food, personal care, household & other categories.
                  </h1>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>


      {/* RELATED PRODUCTS */}

      <div className='
        px-3
        sm:px-5
        md:px-8
        lg:px-12
        mt-8
        sm:mt-10
        md:mt-12
      '>

        <div className='
          grid
          grid-cols-2
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-4
          xl:grid-cols-5
          gap-3
          sm:gap-5
          md:gap-6
        '>

          {filterAll.map((item) => (

            <div
              key={item.id}
              className='
                bg-white
                rounded-xl
                w-full
                shadow-md
                overflow-hidden
                hover:shadow-xl
                transition
              '
            >

              <Link to="/Multi">

                <img
                  onClick={()=>addToItem(item)}
                  className='
                    w-full
                    h-36
                    sm:h-44
                    md:h-52
                    object-contain
                    p-2
                  '
                  src={item.img}
                  alt=""
                />

              </Link>


              <div className='
                p-3
                sm:p-4
              '>

                <h2 className='
                  text-sm
                  sm:text-base
                  md:text-lg
                  font-semibold
                  truncate
                  text-gray-800
                '>
                  {item.title}
                </h2>


                <p className='
                  text-gray-500
                  text-xs
                  sm:text-sm
                  mt-1
                  sm:mt-2
                '>
                  {item.weight}
                </p>


                <div className='
                  flex
                  justify-between
                  items-center
                  gap-1
                  mt-3
                  sm:mt-4
                '>

                  <span className='
                    text-base
                    sm:text-xl
                    font-bold
                    text-green-600
                  '>
                    ₹{item.mrp}
                  </span>


                  {
                    !count[item.id]

                    ?

                    (

                      <button
                        onClick={()=> {
                          increase(item.id),
                          addToCart(item)
                        }}

                        className='
                          border border-green-400
                          text-green-600
                          bg-green-50
                          px-2
                          sm:px-4
                          py-1.5
                          sm:py-2
                          rounded-lg
                          text-xs
                          sm:text-sm
                        '
                      >
                        Add
                      </button>

                    )

                    :

                    (

                      <button
                        className='
                          border border-green-400
                          flex
                          justify-around
                          items-center
                          text-green-800
                          bg-green-300
                          h-8
                          sm:h-10
                          w-16
                          sm:w-20
                          rounded-xl
                        '
                      >

                        <div
                          onClick={()=> decrease(item.id)}
                          className='
                            text-lg
                            sm:text-xl
                            cursor-pointer
                          '
                        >
                          -
                        </div>

                        <div className='
                          text-lg
                          sm:text-xl
                        '>
                          {count[item.id] || 0}
                        </div>

                        <div
                          onClick={()=> increase(item.id)}
                          className='
                            text-lg
                            sm:text-xl
                            cursor-pointer
                          '
                        >
                          +
                        </div>

                      </button>

                    )
                  }

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </>
  )
}

export default Loop