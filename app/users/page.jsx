"use client"
import React, { useState, useEffect } from 'react';
import FirebaseConfig from '@/components/FirebaseConfig/FirebaseConfig';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { getAuth, deleteUser } from 'firebase/auth';
import LayoutAuth from '@/components/LayoutAuth/page';

const firestore = FirebaseConfig().firestore;
const auth = FirebaseConfig().auth;

const TableTwo = () => {
  const [user, setUser] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, "users"));
        const usersData = [];
        querySnapshot.forEach((doc) => {
          usersData.push({ id: doc.id, ...doc.data() });
        });
        setUser(usersData);
      } catch (error) {
        console.error("error", error);
      }
    };
    fetchData();
  }, [user]);

  const handleDeleteUser = async(id) => {
    try{
      //hapus firestore
      await deleteDoc(doc(firestore,"users", id));
      //hapus auth
      const userToDelete = doc(firestore,"users",id);
      const userToDeleteData = (await getDocs(userToDelete)).docs[0].data();
      // pastiin untuk dapat data 
      if(userToDeleteData) {
        await deleteUserFromAuth(userToDeleteData.authId);
      } else{
        console.error("data tidak ad");
        return;
      }
      //perbarui data
      const updatedUser = user.filter((item) => item.id!== id);
      setUser(updatedUser);
      alert("user berhasil di hapus");
    } catch(error) {
      console.error("error deleting user", error);
    }
  }

  const deleteUserFromAuth = async (authId) =>{
    try{
      await deleteUser(auth, authId);
    } catch(error) {
      console.error("error deleting user", error)
    }
  }

  return (
    <LayoutAuth>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="py-6 px-4 md:px-6 xl:px-7.5">
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Users
          </h4>
        </div>

        <div className="grid grid-cols-8 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
          <div className="col-span-2 flex items-center">
            <p className="font-medium">Nama Lengkap</p>
          </div>
          <div className="col-span-2 hidden items-center sm:flex">
            <p className="font-medium">Email</p>
          </div>
          <div className="col-span-2 items-center sm:flex">
            <p className="font-medium">Nama Pengguna</p>
          </div>
          <div className="col-span-1 flex items-center sm:flex">
            <p className="font-medium">Data Bank</p>
          </div>
          <div className="col-span-1 flex mx-auto sm:flex">
            <p className="font-medium">Aksi</p>
          </div>
        </div>

        {user.map((usersItem, index) => (
          <div
            className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
            key={index}
          >
            <div className="col-span-2 flex items-center">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <p className="text-sm text-black dark:text-white">
                  {usersItem.nama_lengkap}
                </p>
              </div>
            </div>
            <div className="col-span-2 hidden items-center sm:flex">
              <p className="text-sm text-black dark:text-white">
                {usersItem.email}
              </p>
            </div>
            <div className="col-span-2 flex items-center">
              <p className="text-sm text-black dark:text-white">
                {usersItem.nama_pengguna}
              </p>
            </div>
            <div className="col-span-1">
              <div className="text-sm text-black dark:text-white">{usersItem.bank?.nama}</div>
              <div className="text-sm text-black dark:text-white">{usersItem.bank?.jenis}</div>
              <div className="text-sm text-meta-3">{usersItem.bank?.no_rekening}</div>
            </div>
            <div className='whitespace-nowrap px-6 py-4'>
              <div className='py-5 px-4 dark:border-strokedark mx-auto'>
                <div className='flex flex-col items-center space-y-3.5'>
                  <button
                  onClick={() => handleDeleteUser(usersItem.id)}
                  className='inline-flex items-center justify-center gap-2 bg-danger py-2 px-4 text-sm font-medium text-white hover:bg-opacity-90 lg:px-6 xl:px-7 w-auto rounded' 
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>

          </div>
        ))}
      </div>
    </LayoutAuth>
  );
};

export default TableTwo;
