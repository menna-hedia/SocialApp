import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import ScrollToTop from "../ScrollToTop/ScrollToTop";
import LeftSidebar from "../LeftSidebar/LeftSidebar";
import { authContext } from "../../context/AuthContext";

const Layout = () => {
  const { userToken } = useContext(authContext);
  const isLoggedIn = !!userToken;

  return (
    <div className="flex min-h-screen flex-col bg-gray-200">
      <ScrollToTop />

      {/* fixed navbar */}
      <div className="sticky top-0 z-40 bg-gray-200 p-5">
        <Navbar />
      </div>

      <main
        className={`flex-grow ${
          isLoggedIn
            ? "mx-auto w-full max-w-[1500px] px-4 lg:grid lg:grid-cols-[260px_minmax(0,1fr)] lg:items-start lg:gap-6"
            : ""
        }`}
      >
        {/* fixed sidebar on every page: lg screens and up */}
        {isLoggedIn && (
          <div className="hidden lg:sticky lg:top-32 lg:block lg:h-[calc(100vh-9rem)] lg:self-start">
            <LeftSidebar />
          </div>
        )}

        <div className="min-w-0">
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Layout;