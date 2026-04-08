import React, { useState, createContext, useEffect } from "react";
import axios from "axios";

// eslint-disable-next-line react-refresh/only-export-components
export const profileContext = createContext();

export default function ProfileContextProvider({ children }) {
  // state لتخزين بيانات البروفايل
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // دالة لجلب بيانات البروفايل من السيرفر
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

  // تحميل البيانات عند أول مرة
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