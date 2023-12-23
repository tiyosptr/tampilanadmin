"use client";
import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  getStorage,
  ref,
  deleteObject,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  addDoc,
  setDoc,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import FirebaseConfig from "@/components/FirebaseConfig/FirebaseConfig";
import LayoutAuth from "@/components/LayoutAuth/page";
import ProtectedRoute from "../auth/ProtectedAuth";

const firestore = FirebaseConfig().firestore;
const storage = FirebaseConfig().storage;

const Table = ({ isLoggedIn }) => {
  const [paket, setPaket] = useState([]);
  const [promo, setPromo] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedData, setEditedData] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const [promoImageFile, setPromoImageFile] = useState(null);
  

  useEffect(() => {
    const fetchData = () => {
      const collectionRef = collection(firestore, "Paket");

      const unsubscribe = onSnapshot(collectionRef, (querSnapshot) => {
        const packageData = [];
        querSnapshot.forEach((doc) => {
          packageData.push({ id: doc.id, ...doc.data() });
        });
        console.log("fetch Paket:", packageData);
        setPaket(packageData);
      });
      return () => unsubscribe();
    };
    fetchData();
  }, []);

  const deletePaket = async (id, imageName) => {
    try {
      await deleteDoc(doc(firestore, "Paket", id));
      const imageRef = ref(storage, "images/" + imageName); // Sesuaikan dengan path penyimpanan gambar Anda
      await deleteObject(imageRef);
      const updatedPaket = paket.filter((item) => item.id !== id);
      setPaket(updatedPaket);
      alert("Paket Berhasil Di Hapus");
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  useEffect(() => {
    const fetchDataPromo = () => {
      const collectionRef = collection(firestore, "Promosi");

      const unsubscribe = onSnapshot(collectionRef, (querySnapshot) => {
        const promoData = [];
        querySnapshot.forEach((doc) => {
          promoData.push({ id: doc.id, ...doc.data() });
        });
        console.log("Feth data promo:", promoData);
        setPromo(promoData);
      });
      return () => unsubscribe();
    };
    fetchDataPromo();
  }, []);

  const editPaket = (data) => {
    setEditedData(data);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setEditedData(null);
  };

  const openImageModal = (packageData) => {
    setSelectedPackage(packageData);
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setSelectedPackage(null);
    setIsImageModalOpen(false);
  };

  const openPromoModal = () => {
    setIsPromoModalOpen(true);
  };

  const closePromoModal = () => {
    setIsPromoModalOpen(false);
    setPromoImageFile(null);
  };

  const handlePromoImageChange = (e) => {
    const file = e.target.files[0];
    setPromoImageFile(file);
  };

  const addPromoImage = async () => {
    if (!promoImageFile) {
      alert("Silakan pilih gambar terlebih dahulu!");
      return;
    }

    try {
      // Membuat dokumen baru dengan ID yang sesuai
      const newPromoDocRef = doc(firestore, "Promosi", uuidv4());

      // Menambahkan URL gambar promo ke dokumen baru
      const promoData = {
        promoImage: "", // Tentukan properti lain sesuai kebutuhan
      };
      await setDoc(newPromoDocRef, promoData);

      // Upload gambar ke penyimpanan dan mendapatkan URL-nya
      const storageRef = ref(storage, `promoImages/${uuidv4()}`);
      await uploadBytes(storageRef, promoImageFile);
      const downloadURL = await getDownloadURL(storageRef);

      // Menambahkan URL gambar ke dokumen promosi
      const updatedPromoData = {
        promoImage: downloadURL,
        // Tambahan properti lain sesuai kebutuhan
      };
      await updateDoc(newPromoDocRef, updatedPromoData);

      // Menutup modal dan membersihkan state
      setIsPromoModalOpen(false);
      setPromoImageFile(null);

      alert("Gambar promosi berhasil ditambahkan!");
    } catch (error) {
      console.error("Error adding promo image: ", error);
    }
  };

  const updatePaket = async () => {
    try {
      if (editedData) {
        const { id, ...restData } = editedData;
        await updateDoc(doc(firestore, "Paket", id), restData);
        setIsModalOpen(false);
        setEditedData(null);
        alert("Paket Berhasil Diperbarui");
      }
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  return (
    <LayoutAuth>
      <div className="mb-14">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex justify-between items-center py-6 px-4 md:px-6 xl:px-7.5">
            <h4 className="text-xl font-semibold text-black dark:text-white">
              Paket
            </h4>

            <Link
              href="/dashboard/create"
              className="inline-flex items-center justify-center gap-2 bg-primary py-2 px-4 text-sm font-medium text-white hover:bg-opacity-90 lg:px-6 xl:px-7 w-auto"
            >
              <span>
                <svg
                  className="fill-current"
                  width="16"
                  height="16"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 2C5.58997 2 2 5.58997 2 10C2 14.41 5.58997 18 10 18C14.41 18 18 14.41 18 10C18 5.58997 14.41 2 10 2ZM11 5V9H15V11H11V15H9V11H5V9H9V5H11Z"
                    fill=""
                  />
                </svg>
              </span>
              Tambah Paket
            </Link>
          </div>
          <div className="flex flex-col overflow-x-auto">
            <div className="sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                <div className="overflow-x-auto">
                  <table className="min-w-full text-center text-sm font-light">
                    <thead className="border-b font-medium dark:border-neutral-500">
                      <tr>
                        <th scope="coll" className="px-6 py-4">
                          Nama Paket
                        </th>
                        <th scope="coll" className="px-6 py-4">
                          Studio
                        </th>
                        <th scope="coll" className="px-6 py-4">
                          Background Studio
                        </th>
                        <th scope="coll" className="px-6 py-4">
                          Deskripsi
                        </th>
                        <th scope="coll" className="px-6 py-4">
                          Orang
                        </th>
                        <th scope="coll" className="px-6 py-4">
                          Waktu
                        </th>
                        <th scope="coll" className="px-6 py-4">
                          Ganti Pakaian
                        </th>
                        <th scope="coll" className="px-6 py-4">
                          Keuntungan
                        </th>
                        <th scope="coll" className="px-6 py-4">
                          Harga
                        </th>
                        <th scope="coll" className="px-6 py-4">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {paket.map((packageItem, index) => (
                        <tr
                          className="boder-b dark:boder-neutral-500"
                          key={index}
                        >
                          <td className="whitespace-nowrap px-6 py-4">
                            {packageItem.nama_paket}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <div className="h-12.5 w-15 rounded-md">
                              <img
                                src={packageItem.url_gambar}
                                width={60}
                                height={50}
                              />
                            </div>
                          </td>

                          <td className="whitespace-nowrap px-6 py-4">
                            <button
                              onClick={() => openImageModal(packageItem)}
                              className="text-primary underline cursor-pointer"
                            >
                              Lihat Background Studio
                            </button>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            {packageItem.deskripsi}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            {packageItem.orang}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            {packageItem.waktu}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            {packageItem.ganti_pakaian}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            {packageItem.keuntungan ? (
                              Object.keys(packageItem.keuntungan).map(
                                (key, benefitIndex) => (
                                  <div key={benefitIndex}>
                                    {`${benefitIndex + 1}: ${
                                      packageItem.keuntungan[key]
                                    }`}
                                  </div>
                                )
                              )
                            ) : (
                              <div className="text-warning">
                                No Benefits available
                              </div>
                            )}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-meta-3">
                            Rp{packageItem.harga}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            <td className="py-5 px-4 dark:border-strokedark mx-auto">
                              <div className="flex flex-col items-center space-y-3.5">
                                <button
                                  onClick={() => editPaket(packageItem)}
                                  className="inline-flex items-center justify-center gap-2 bg-primary py-2 px-4 text-sm font-medium text-white hover:bg-opacity-90 lg:px-6 xl:px-7 w-auto rounded mb-2"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => deletePaket(packageItem.id)}
                                  className="inline-flex items-center justify-center gap-2 bg-danger py-2 px-4 text-sm font-medium text-white hover:bg-opacity-90 lg:px-6 xl:px-7 w-auto rounded mb-2"
                                >
                                  Hapus
                                </button>
                              </div>
                            </td>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedPackage && isImageModalOpen && (
        <div
          autoFocus
          className="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center bg-black bg-opacity-50 rounded"
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-8 w-4/5 sm:w-2/3 md:w-1/2 lg:w-1/3 dark:bg-boxdark">
            <h2 className="text-2xl font-semibold mb-4">
              {selectedPackage.nama_paket} Studio
            </h2>
            {Object.keys(selectedPackage.background_images).length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {Object.keys(selectedPackage.background_images).map((key) => (
                  <div key={key} className="h-48 w-48">
                    <img
                      src={selectedPackage.background_images[key]}
                      alt={`Background ${key}`}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-warning">Tidak Ada Studio</p>
            )}
            <button
              onClick={closeImageModal}
              className="bg-blue-500 text-white bg-danger py-2 px-4 rounded-lg mt-4 hover:bg-opacity-90"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div
          autoFocus
          className="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center bg-black bg-opacity-50 rounded"
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-8 w-4/5 sm:w-2/3 md:w-1/2 lg:w-1/3 dark:bg-boxdark">
            {editedData && (
              <div className="flex flex-col space-y-4 ">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-black dark:text-white text-sm font-semibold mb-2">
                      Nama Paket
                    </label>
                    <input
                      type="text"
                      value={editedData.nama_paket}
                      onChange={(e) =>
                        setEditedData({
                          ...editedData,
                          nama_paket: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-gray-300 py-2 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:bg-white dark:text-black dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-black dark:text-white text-sm font-semibold mb-2">
                      Deskripsi
                    </label>
                    <input
                      type="text"
                      value={editedData.deskripsi}
                      onChange={(e) =>
                        setEditedData({
                          ...editedData,
                          deskripsi: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-gray-300 py-2 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:bg-white dark:text-black dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-black dark:text-white text-sm font-semibold mb-2">
                      Orang
                    </label>
                    <input
                      type="text"
                      value={editedData.orang}
                      onChange={(e) =>
                        setEditedData({
                          ...editedData,
                          orang: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-gray-300 py-2 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-black dark:text-white text-sm font-semibold mb-2">
                      Waktu
                    </label>
                    <input
                      type="text"
                      value={editedData.waktu}
                      onChange={(e) =>
                        setEditedData({
                          ...editedData,
                          waktu: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-gray-300 py-2 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-black dark:text-white text-sm font-semibold mb-2">
                      Ganti Pakaian
                    </label>
                    <input
                      type="text"
                      value={editedData.ganti_pakaian}
                      onChange={(e) =>
                        setEditedData({
                          ...editedData,
                          ganti_pakaian: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-gray-300 py-2 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-black dark:text-white text-sm font-semibold mb-2">
                      Keuntungan
                    </label>
                    <input
                      type="text"
                      value={editedData.keuntungan}
                      onChange={(e) =>
                        setEditedData({
                          ...editedData,
                          keuntungan1: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-gray-300 py-2 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-black dark:text-white text-sm font-semibold mb-2">
                      Harga
                    </label>
                    <input
                      type="text"
                      value={editedData.harga}
                      onChange={(e) =>
                        setEditedData({
                          ...editedData,
                          harga: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-gray-300 py-2 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>
                </div>
                <button
                  onClick={updatePaket}
                  className="bg-blue-500 text-white bg-primary py-2 px-4 rounded-lg hover:bg-opacity-90"
                >
                  Simpan Perubahan
                </button>
                <button
                  onClick={closeModal}
                  className="bg-blue-500 text-white bg-danger py-2 px-4 rounded-lg hover:bg-opacity-90"
                >
                  Batal
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark mt-14">
        <div className="flex justify-between items-center py-6 px-4 md:px-6 xl:px-7.5">
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Poster Promosi / Highlight
          </h4>
          <button
            onClick={openPromoModal}
            className="inline-flex items-center justify-center gap-2 bg-primary py-2 px-4 text-sm font-medium text-white hover:bg-opacity-90 lg:px-6 xl:px-7 w-auto"
          >
            <span>
              <svg
                className="fill-current"
                width="16"
                height="16"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 2C5.58997 2 2 5.58997 2 10C2 14.41 5.58997 18 10 18C14.41 18 18 14.41 18 10C18 5.58997 14.41 2 10 2ZM11 5V9H15V11H11V15H9V11H5V9H9V5H11Z"
                  fill=""
                />
              </svg>
            </span>
            Tambah
          </button>
        </div>

        <div className="grid grid-cols-8 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
          <div className="col-span-2 flex items-center">
            <p className="font-medium">Gambar</p>
          </div>
        </div>
        {promo.map((promoItem, index) => (
          <div
            key={index}
            className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
          >
            <div className="col-span-2 flex items-center">
              <div className="h-12.5 w-15 rounded-md">
                <img src={promoItem.promoImage} width={60} height={50} />
              </div>
            </div>
            <div className="whitespace-nowrap px-6 py-4">
              <div className="py-5 px-4 dark:border-strokedark mx-auto">
                <div className="flex flex-col items-center space-y-3.5">
                  <button className="inline-flex items-center justify-center gap-2 bg-danger py-2 px-4 text-sm font-medium text-white hover:bg-opacity-90 lg:px-6 xl:px-7 w-auto rounded">
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isPromoModalOpen && (
        <div
          autoFocus
          className="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center bg-black bg-opacity-50 rounded"
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-8 w-4/5 sm:w-2/3 md:w-1/2 lg:w-1/3 dark:bg-boxdark">
            <h2 className="text-2xl font-semibold mb-4">Tambah Gambar Promo</h2>
            <label className="block text-black dark:text-white text-sm font-semibold mb-2">
              Gambar Promo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePromoImageChange}
              className="w-full rounded-lg border border-gray-300 py-2 px-4 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
            <button
              onClick={addPromoImage}
              className="bg-blue-500 text-white bg-primary py-2 px-4 rounded-lg hover:bg-opacity-90 mt-4"
            >
              Tambah Gambar Promo
            </button>
            <button
              onClick={closePromoModal}
              className="bg-blue-500 text-white bg-danger py-2 px-4 rounded-lg hover:bg-opacity-90 mt-2"
            >
              Batal
            </button>
          </div>
        </div>
      )}


<div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark mt-14">
        <div className="flex justify-between items-center py-6 px-4 md:px-6 xl:px-7.5">
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Bank Admin
          </h4>
          <button
            className="inline-flex items-center justify-center gap-2 bg-primary py-2 px-4 text-sm font-medium text-white hover:bg-opacity-90 lg:px-6 xl:px-7 w-auto"
          >
            <span>
              <svg
                className="fill-current"
                width="16"
                height="16"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 2C5.58997 2 2 5.58997 2 10C2 14.41 5.58997 18 10 18C14.41 18 18 14.41 18 10C18 5.58997 14.41 2 10 2ZM11 5V9H15V11H11V15H9V11H5V9H9V5H11Z"
                  fill=""
                />
              </svg>
            </span>
            Tambah
          </button>
        </div>

        <div className="grid grid-cols-8 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
          <div className="col-span-2 flex items-center">
            <p className="font-medium">No</p>
          </div>
          <div className="col-span-2 flex items-center">
            <p className="font-medium">Nama Lengkap Bank</p>
          </div>
          <div className="col-span-2 flex items-center">
            <p className="font-medium">Jenis Bank</p>
          </div>
          <div className="col-span-2 flex items-center">
            <p className="font-medium">No Rekening</p>
          </div>
        </div>
          <div
            className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
          >
            <div className="col-span-2 flex items-center">
              <div className="h-12.5 w-15 rounded-md">
                <p>asbdasfv</p>
              </div>
            </div>
            <div className="whitespace-nowrap px-6 py-4">
              <div className="py-5 px-4 dark:border-strokedark mx-auto">
                <div className="flex flex-col items-center space-y-3.5">
                  <button className="inline-flex items-center justify-center gap-2 bg-danger py-2 px-4 text-sm font-medium text-white hover:bg-opacity-90 lg:px-6 xl:px-7 w-auto rounded">
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          </div>
      </div>
    </LayoutAuth>
  );
};

export default Table;
