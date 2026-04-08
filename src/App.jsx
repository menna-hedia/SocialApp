import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from "./Components/Home/Home";
import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";
import NotFound from "./Components/NotFound/NotFound";
import Layout from './Components/Layout/Layout';
import AuthContextProvider from './context/AuthContext';
import Profile from './Components/Profile/Profile';
import RoutesProtector from './Components/RoutesProtector/RoutesProtector';
import RoutesAntiProtector from './Components/RoutesAntiProtector/RoutesAntiProtector';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PostDetails from './Components/PostDetails/PostDetails';
import { HeroUIProvider } from "@heroui/react";
import { ToastContainer } from 'react-toastify';
import ProfileContextProvider from './context/ProfileContext';
import About from './Components/About/About';

const App = () => {

  const router = createBrowserRouter([
    {
      path: "", element: <Layout />, children: [
        { index: true, element: <RoutesProtector> <Home /> </RoutesProtector> },
        { path: "home", element: <RoutesProtector> <Home /> </RoutesProtector> },
        { path: "login", element: <RoutesAntiProtector> <Login /> </RoutesAntiProtector> },
        { path: "register", element: <RoutesAntiProtector> <Register /> </RoutesAntiProtector> },
        { path: "profile", element: <RoutesProtector> <Profile /> </RoutesProtector> },
        { path: "about", element: <RoutesProtector> <About /> </RoutesProtector> },
        { path: "postDetails/:id", element: <RoutesProtector> <PostDetails /> </RoutesProtector> },
        { path: "*", element: <RoutesProtector> <NotFound /> </RoutesProtector> },
      ]
    },
  ])

  // default config 
  const queryClientConfig = new QueryClient();

  return (
    <>
      <QueryClientProvider client={queryClientConfig}>
        <HeroUIProvider>
          <AuthContextProvider>
            <ProfileContextProvider>
              <RouterProvider router={router} />
              <ToastContainer />
            </ProfileContextProvider>
          </AuthContextProvider>
        </HeroUIProvider>
      </QueryClientProvider>
    </>
  )
}

export default App
