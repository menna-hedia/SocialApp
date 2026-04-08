import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authContext } from "../../context/AuthContext";
import { profileContext } from "../../context/ProfileContext";

const Navbar = () => {
    const [openMenu, setOpenMenu] = useState(false);
    const [openMobile, setOpenMobile] = useState(false);
    
        const dropdownRef = useRef();

    // function resetMenu() {
    //     setOpenMenu(false);
    //     setOpenMobile(false);
    // }

    // useEffect(() => {
    //     // eslint-disable-next-line react-hooks/set-state-in-effect
    //     resetMenu();
    // },[]);

    const { userToken, clearUserToken } = useContext(authContext);
    const navigate = useNavigate();

    const { profile } = useContext(profileContext);
    const photo = profile?.photo || "https://avatars.githubusercontent.com/u/86160567?s=200&v=4";

    // derived state ==> var based on state
    const isUserLoggedIn = !!userToken;

    // logout function 
    function handleLogout() {
        localStorage.removeItem('token');
        clearUserToken()
        setOpenMenu(false)
        setOpenMobile(false);
        navigate("/login")
    }

    useEffect(() => {
        function handleClickOutside(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpenMenu(false);
                setOpenMobile(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <>
            <nav className="flex items-center justify-between p-6 shadow-lg bg-white rounded-xl ">
                {/* LEFT (Logo) */}
                <Link to="/home" className="text-xl font-bold text-indigo-500">
                    {isUserLoggedIn ? "MySocialApp" : "Start Your Social Journey"}
                </Link>


                {/* CENTER (Links Desktop) */}
                {isUserLoggedIn ?
                    <div className="hidden lg:flex gap-8">
                        <Link to="/home" className="font-semibold hover:text-gray-700">Home</Link>
                        <Link to="/about" className="font-semibold hover:text-gray-700">About</Link>
                        <Link to="/profile" className="font-semibold hover:text-gray-700">Profile</Link>
                    </div>
                    :
                    <div className="hidden lg:flex gap-4 ml-auto">
                        <Link to="/login" className="font-semibold hover:text-gray-700">Login</Link>
                        <Link to="/register" className="font-semibold hover:text-gray-700">Register</Link>
                    </div>
                }
                {/* RIGHT */}
                <div className="flex items-center gap-4">

                    {/* Avatar + Dropdown */}
                    <div className="relative hidden lg:block">
                        {isUserLoggedIn ?

                            <button onClick={() => setOpenMenu(!openMenu)}>
                                <img
                                    className="w-8 h-8 rounded-full"
                                    src={photo}
                                    alt="user"
                                />
                            </button>

                            : ""}
                        {openMenu && (
                            <div ref={dropdownRef} className="absolute right-0 mt-3 w-44 bg-gray-100 rounded-lg shadow-lg ">
                                <ul className="p-2 text-sm">

                                    <li>
                                        <Link to="/profile" className="block w-full text-left p-2 hover:bg-gray-200 rounded"
                                        onClick={() => setOpenMenu(false)} >
                                            Profile
                                        </Link>
                                    </li>
                                    <li>
                                        <button className="w-full text-left p-2 hover:bg-red-100 text-red-500 rounded"
                                            onClick={handleLogout}>
                                            Logout
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>


                    {/* Mobile Menu Button */}
                    <button onClick={() => setOpenMobile(!openMobile)} className="lg:hidden text-2xl">
                        ☰
                    </button>
                </div>

                {/* MOBILE MENU */}
                {openMobile && (
                    <div ref={dropdownRef} className=" z-3 my-6 absolute top-20 left-0 text-center w-full mx-auto bg-white shadow-md flex flex-col items-center gap-4 p-4 lg:hidden">
                        {isUserLoggedIn ?
                            <>
                                <Link to="/home" className="w-full p-2 hover:bg-gray-200 rounded block">Home</Link>
                                <Link to="/about" className="w-full p-2 hover:bg-gray-200 rounded block"onClick={() => setOpenMenu(false)}>About</Link>
                                <Link to="/profile" className="w-full p-2 hover:bg-gray-200 rounded block" onClick={() => setOpenMenu(false)} >Profile</Link>
                                <button className="w-full p-2 hover:bg-red-100 text-red-400 rounded block" onClick={handleLogout}> Logout </button>
                            </>
                            :
                            <>
                                <Link to="/register" className="w-full p-2 hover:bg-gray-200 rounded">Register</Link>
                                <Link to="/login" className="w-full p-2 hover:bg-gray-200 rounded">Login</Link>
                            </>
                        }
                    </div>
                )}

            </nav>
        </>

    );
};

export default Navbar;