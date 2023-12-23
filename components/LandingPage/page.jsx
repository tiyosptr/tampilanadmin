import React from 'react';
import Link from 'next/link';

const LandingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <p className='mb-4 text-lg'>Selamat Datang</p>
      <p className='mb-4 text-lg'>Selamat Bekerja</p>
      <Link href="/auth" className="inline-flex items-center gap-2 bg-primary py-2 px-4 text-sm font-medium text-white hover:bg-opacity-90 lg:px-6 xl:px-7 w-auto rounded-lg">
        Login
      </Link>
    </div>
  );
};

export default LandingPage;
