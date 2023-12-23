"use client"
import './globals.css'
import "./data-tables-css.css";
import { useState, useEffect } from "react";
import Loader from '@/components/common';


export default function RootLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);
  
  return (
    <html lang="en">
      <body  suppressHydrationWarning={true}>
      <div className="dark:bg-boxdark-2 dark:text-bodydark">

                <main>
                  <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                    {children}
                  </div>
                </main>
  
        </div>
      </body>
    </html>
  )
}
