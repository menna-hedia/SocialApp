import React from 'react'
import Navbar from '../Navbar/Navbar'
import { Outlet } from 'react-router-dom';
import Footer from '../Footer/Footer';

const Layout = () => {
  return (
    <>
      <div className="flex flex-col min-h-screen bg-gray-900">
        <div className="p-5">
          <Navbar />
        </div>
  

  <main className="flex-grow">
    <Outlet />
  </main>

  <Footer />
</div>
    </>
  )
}

export default Layout
