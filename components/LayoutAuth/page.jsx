"use client";
import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Loader from "@/components/common";

function LayoutAuth({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const [isLoggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      checkLoginStatus();
    }, 1000);
  }, []);

  const checkLoginStatus = () => {
    // Check the user's login status, for example, by validating the session cookie
    const userCookie = cookies.user;
    if (userCookie) {
      setLoggedIn(true);
    }
  };

  const handleLogin = () => {
    // Perform login actions and set the session cookie
    setCookie("user", "user_token", { path: "/" });
    setLoggedIn(true);
  };

  const handleLogout = () => {
    // Perform logout actions and remove the session cookie
    removeCookie("user", { path: "/" });
    setLoggedIn(false);
  };

  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <div className="dark:bg-boxdark-2 dark:text-bodydark">
          <div className="flex h-screen overflow-hidden">
            {/* <!-- ===== Sidebar Start ===== --> */}
            <Sidebar
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            />
            {/* <!-- ===== Sidebar End ===== --> */}

            {/* <!-- ===== Content Area Start ===== --> */}
            <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
              {/* <!-- ===== Header Start ===== --> */}
              <Header
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                isLoggedIn={isLoggedIn}
                onLogin={handleLogin}
                onLogout={handleLogout}
              />
              {/* <!-- ===== Header End ===== --> */}

              {/* <!-- ===== Main Content Start ===== --> */}
              <main>
                <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                  {children}
                </div>
              </main>
              {/* <!-- ===== Main Content End ===== --> */}
            </div>
            {/* <!-- ===== Content Area End ===== --> */}
          </div>
        </div>
      </body>
    </html>
  );
}

export default LayoutAuth;
