import React from 'react'

export default function Loader() {
  return (
    <div className='flex justify-center items-center h-screen'>
        {/* <h1>Please be patient as your data is being fetched ...</h1> */}
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
    </div>
  )
}
