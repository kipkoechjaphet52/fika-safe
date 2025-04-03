import About from '@/app/Components/About';
import Footer from '@/app/Components/Footer';
import Header from '@/app/Components/Header';
import React from 'react';

export default function AboutPage(){
  return(
    <div className='w-full h-full'>
      <Header/>
      <About/>
      <Footer/>
    </div>
  );
}