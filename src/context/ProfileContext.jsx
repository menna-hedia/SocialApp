import React, { useState, createContext, useEffect } from "react";
import axios from "axios";

export const profileContext = createContext();

export default function ProfileContextProvider({ children }) {

  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  async function getMyProfile() {
    try {
      const res = await axios.get(
        "https://route-posts.routemisr.com/users/profile-data",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setProfile(res.data.data.user); 
    } catch (error) {
      console.error("Error fetching profile:", error);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getMyProfile();
  }, []);

  return (
    <profileContext.Provider
      value={{ profile, setProfile, isLoading, getMyProfile }}
    >
      {children}
    </profileContext.Provider>
  );
}