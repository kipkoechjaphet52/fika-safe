import React from 'react'

export default function About() {
  return (
    <div className='w-full h-full items-center text-center my-5 md:px-44 max-[425px]:px-10'>
        <h1 className='text-3xl font-bold '>About Us</h1>
        <div className='my-4'>
          <h1 className='font-bold text-lg'>
            Empowering communities, Enhancing Safety.
          </h1>
          <p>
              At Fika-Safe, we believe that a safer world starts with awareness and action.
              In an era where information is at our fingertips,security should be no exception.
              That&apos;s why we&apos;re building an intelligent, real-time security incident reporting 
              and alert system—to help you stay informed, make safer decisions, and protect 
              what matters most.
          </p>
        </div>
        <div className='my-4'>
          <h1 className='font-bold text-3xl'>Our Mission.</h1>
          <p className='my-4'>
              We are on a mission to empower individuals and communities by providing real-time
              security updates, incident reports, and smart route recommendations. Whether you&apos;re
              commuting, exploring a new neighborhood, or ensuring loved ones get home safely,
              Fika-Safe is your trusted companion for security awareness.
          </p>
        </div>
    </div>
  )
}
