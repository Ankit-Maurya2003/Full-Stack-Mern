import React from 'react'
import { categories } from '../Component/Items'
import { productive } from '../Component/Items'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useCart } from '../Component/Supplier'

const Medical = () => {

  const [select, setSelect] = useState("");

  const Items = productive.filter(
    (item) => !select || item.category === select
  )

  const {
    addToCart,
    count,
    setCount,
    increase,
    decrease,
    addToItem
  } = useCart();

  return (
    <>
      <div className='
        grid
        grid-cols-10
        md:mt-35
        lg:mt-25
        mt-40
        max-w-7xl
        mx-auto
        h-auto
      '>

        {/* HEADING */}
        <div className='
          col-span-10
          border
          font-bold
          p-2
          text-base
          sm:text-lg
        '>
          Stock up on daily essential
        </div>


        {/* MEDICAL CATEGORY */}
        <div className='
          col-span-10
          md:col-span-1
          sm:col-span-3
          border

          flex
          sm:grid
          sm:grid-cols-1

          gap-2
          sm:gap-6

          overflow-x-auto
          sm:overflow-y-auto
          sm:overflow-x-hidden

          h-auto
          sm:h-130

          p-2
          sm:p-0

          scrollbar-hide
        '>

          {categories.map((cat) => (

            <div
              key={cat.name}
              className='
                shrink-0
                w-24
                sm:w-auto
                p-2
                sm:p-5
                text-center
                cursor-pointer
              '
            >

              <div
                className='
                  w-full
                  flex
                  flex-col
                  items-center
                  justify-center
                '
                onClick={() => setSelect(cat.name)}
              >

                <img
                  src={cat.img}
                  className='
                    w-16
                    h-16
                    sm:w-full
                    sm:h-auto
                    object-contain
                  '
                  alt=""
                />

                <p className='
                  mt-1
                  text-xs
                  sm:text-sm
                  truncate
                  w-full
                '>
                  {cat.name}
                </p>

              </div>

            </div>

          ))}

        </div>


        {/* PRODUCTS */}
        <div className='
          col-span-10
          sm:col-span-7
          md:col-span-9

          grid
          grid-cols-2
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-5

          gap-2
          sm:gap-4

          overflow-y-auto

          h-auto
          sm:h-130

          border

          p-1
          sm:p-0
        '>

          {Items.map((item) => (

            <div
              className='
                p-1
                sm:p-3
              '
              key={item.id}
            >

              <div className='
                p-2
                border
                rounded-lg
                h-full
              '>

                {/* IMAGE */}
                <Link
                  to="/Multi"
                  onClick={() => addToItem(item)}
                >

                  <img
                    src={item.img}
                    alt=""
                    className='
                      w-full
                      h-32
                      sm:h-40
                      object-contain
                    '
                  />

                </Link>


                {/* TITLE */}
                <p className='
                  pt-2.5
                  text-sm
                  sm:text-base
                  truncate
                '>
                  {item.title}
                </p>


                {/* WEIGHT */}
                <span className='
                  text-xs
                  sm:text-sm
                  text-gray-400
                '>
                  {item.weight}
                </span>

                <br />


                {/* PRICE + BUTTON */}
                <span className='
                  text-blue-800
                  flex
                  justify-between
                  items-center
                  gap-1
                  mt-1
                '>

                  <span className='
                    text-sm
                    sm:text-base
                    font-medium
                  '>
                    ₹{item.mrp}
                  </span>


                  {/* ADD */}
                  {!count[item.id] ? (

                    <button
                      onClick={() => {
                        increase(item.id),
                        addToCart(item)
                      }}

                      className='
                        border
                        border-green-400
                        text-green-600
                        bg-green-50
                        px-3
                        sm:px-4
                        py-1.5
                        sm:py-2
                        rounded-lg
                        text-sm
                        sm:text-base
                      '
                    >
                      Add
                    </button>

                  ) : (

                    <button
                      className='
                        border
                        border-green-400
                        flex
                        justify-around
                        items-center
                        text-green-800
                        bg-green-300
                        h-9
                        sm:h-10
                        w-18
                        sm:w-20
                        rounded-xl
                      '
                    >

                      <div
                        onClick={() => decrease(item.id)}
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
                        onClick={() => increase(item.id)}
                        className='
                          text-lg
                          sm:text-xl
                          cursor-pointer
                        '
                      >
                        +
                      </div>

                    </button>

                  )}

                </span>

              </div>

            </div>

          ))}

        </div>

      </div>
    </>
  )
}

export default Medical