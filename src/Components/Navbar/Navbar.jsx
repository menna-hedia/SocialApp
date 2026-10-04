import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { LuHouse, LuUser, LuInfo, LuBookmark, LuBell, LuLogOut } from "react-icons/lu";
import { authContext } from "../../context/AuthContext";
import { profileContext } from "../../context/ProfileContext";
import { useUnreadCount, getUnreadCount } from "../../hooks/useNotifications";
import PostCreation from "../PostCreation/PostCreation";

const FALLBACK_AVATAR = "https://avatars.githubusercontent.com/u/86160567?s=200&v=4";

const mobileLinks = [
    { to: "/home", label: "Home", icon: LuHouse },
    { to: "/profile", label: "Profile", icon: LuUser },
    { to: "/about", label: "About", icon: LuInfo },
    { to: "/bookmarks", label: "Saved", icon: LuBookmark },
    { to: "/notifications", label: "Notifications", icon: LuBell },
];

const Navbar = () => {
    const [openMenu, setOpenMenu] = useState(false);
    const [openMobile, setOpenMobile] = useState(false);

    const desktopRef = useRef(null);
    const mobileRef = useRef(null);

    const { userToken, clearUserToken } = useContext(authContext);
    const navigate = useNavigate();

    const { profile } = useContext(profileContext) || {};
    const photo = profile?.photo || FALLBACK_AVATAR;

    const isUserLoggedIn = !!userToken;

    // unread notifications badge (the request runs only when logged in)
    const { data: unreadData } = useUnreadCount();
    const unread = isUserLoggedIn ? getUnreadCount(unreadData) : 0;

    function handleLogout() {
        localStorage.removeItem("token");
        clearUserToken();
        setOpenMenu(false);
        setOpenMobile(false);
        navigate("/login");
    }

    // each menu closes only when the click is outside of its own area
    useEffect(() => {
        function handleClickOutside(e) {
            if (desktopRef.current && !desktopRef.current.contains(e.target)) {
                setOpenMenu(false);
            }
            if (mobileRef.current && !mobileRef.current.contains(e.target)) {
                setOpenMobile(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const mobileLinkClass = ({ isActive }) =>
        `flex w-full items-center gap-3 rounded-lg px-4 py-3 text-base font-medium transition ${
            isActive ? "bg-indigo-50 text-indigo-600" : "text-gray-700 hover:bg-gray-100"
        }`;

    return (
        <nav className="relative flex items-center justify-between rounded-xl bg-white p-5 shadow-lg">
            {/* LEFT (Logo) */}
            <Link to="/home" className="text-xl font-bold text-indigo-500">
                {isUserLoggedIn ? "MySocialApp" : "Start Your Social Journey"}
            </Link>

            {/* CENTER */}
            {isUserLoggedIn ? (
                <div className="mx-6 hidden max-w-xl flex-1 lg:block">
                    <PostCreation compact />
                </div>
            ) : (
                <div className="ml-auto hidden gap-4 lg:flex">
                    <Link to="/login" className="font-semibold hover:text-gray-700">Sign In</Link>
                    <Link to="/register" className="font-semibold hover:text-gray-700">Sign Up</Link>
                </div>
            )}

            {/* RIGHT */}
            <div className="flex items-center gap-4">
                {/* Avatar + Dropdown (desktop) */}
                {isUserLoggedIn && (
                    <div ref={desktopRef} className="relative hidden lg:block">
                        <button type="button" onClick={() => setOpenMenu((v) => !v)}>
                            <img
                                className="h-8 w-8 rounded-full border-2 border-gray-200 object-cover"
                                src={photo}
                                alt="user"
                                onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = FALLBACK_AVATAR;
                                }}
                            />
                        </button>

                        {openMenu && (
                            <div className="absolute right-0 z-50 mt-3 w-44 rounded-lg bg-gray-100 shadow-lg">
                                <ul className="p-2 text-sm">
                                    <li>
                                        <Link
                                            to="/profile"
                                            className="block w-full rounded p-2 text-left hover:bg-gray-200"
                                            onClick={() => setOpenMenu(false)}
                                        >
                                            Profile
                                        </Link>
                                    </li>
                                    <li>
                                        <button
                                            type="button"
                                            className="w-full rounded p-2 text-left text-red-500 hover:bg-red-100"
                                            onClick={handleLogout}
                                        >
                                            Sign Out
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                {/* Mobile button + menu */}
                <div ref={mobileRef} className="lg:hidden">
                    <button
                        type="button"
                        onClick={() => setOpenMobile((v) => !v)}
                        className="relative text-2xl"
                        aria-label="Toggle menu"
                    >
                        {openMobile ? "✕" : "☰"}
                        {/* dot on the burger when there are unread notifications */}
                        {!openMobile && unread > 0 && (
                            <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-indigo-500 ring-2 ring-white" />
                        )}
                    </button>

                    {openMobile && (
                        <ul className="absolute left-0 top-full z-50 mt-3 w-full rounded-xl bg-white p-3 shadow-lg">
                            {isUserLoggedIn ? (
                                <>
                                    {mobileLinks.map(({ to, label, icon: Icon }) => (
                                        <li key={to}>
                                            <NavLink
                                                to={to}
                                                className={mobileLinkClass}
                                                onClick={() => setOpenMobile(false)}
                                            >
                                                <Icon className="text-xl" />
                                                {label}
                                                {to === "/notifications" && unread > 0 && (
                                                    <span className="ms-auto rounded-full bg-indigo-500 px-2 py-0.5 text-xs font-bold text-white">
                                                        {unread > 99 ? "99+" : unread}
                                                    </span>
                                                )}
                                            </NavLink>
                                        </li>
                                    ))}

                                    <li className="mt-2 border-t border-gray-100 pt-2">
                                        <button
                                            type="button"
                                            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-base font-medium text-red-500 hover:bg-red-50"
                                            onClick={handleLogout}
                                        >
                                            <LuLogOut className="text-xl" />
                                            Sign Out
                                        </button>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li><NavLink to="/login" className={mobileLinkClass} onClick={() => setOpenMobile(false)}>Sign In</NavLink></li>
                                    <li><NavLink to="/register" className={mobileLinkClass} onClick={() => setOpenMobile(false)}>Sign Up</NavLink></li>
                                </>
                            )}
                        </ul>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;