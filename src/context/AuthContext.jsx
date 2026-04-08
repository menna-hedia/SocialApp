import React, { useState, createContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const authContext = createContext();

export default function AuthContextProvider({ children }) {

    const [userToken, setUserToken] = useState(() => {
        const token = localStorage.getItem("token");

        return token && token.split(".").length === 3 ? token : null;
    });

    const [userId, setUserId] = useState(null);

    function setAuthenticatedUserToken(token) {
        if (!token) return;
        setUserToken(token);
        localStorage.setItem("token", token);
    }

    function clearUserToken() {
        setUserToken(null);
        setUserId(null);
        localStorage.removeItem("token");
    }


    function decodeUserToken() {
        if (!userToken) return;
        try {
            const decodedToken = jwtDecode(userToken);
            setUserId(decodedToken.user); 
        } catch (error) {
            console.error("Invalid token:", error);
            clearUserToken();
        }
    }

    useEffect(() => {
        decodeUserToken();
    }, [userToken]);

    return (
        <authContext.Provider
            value={{
                userToken,
                setAuthenticatedUserToken,
                clearUserToken,
                userId,
            }}
        >
            {children}
        </authContext.Provider>
    );
}