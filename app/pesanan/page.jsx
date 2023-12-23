"use client";
import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, updateDoc,  onSnapshot } from "firebase/firestore";
import Modal from "react-modal";
import FirebaseConfig from "@/components/FirebaseConfig/FirebaseConfig";
import LayoutAuth from "@/components/LayoutAuth/page";

const firestore = FirebaseConfig().firestore;

const TableThree = () => {
  const [pesanan, setPesanan] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility
  const [selectedImage, setSelectedImage] = useState("");
  const [editData, setEditData] = useState(null);
   const [isChecked, setIsChecked] = useState(editData?.status_pembayaran === "Lunas" || false);
   const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
   const [isEditModalOpen, setIsEditModalOpen] = useState(false);

   useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, "Pemesanan"));
        const checkoutData = [];
        querySnapshot.forEach((doc) => {
          checkoutData.push({ id: doc.id, ...doc.data() });
        });
        setPesanan(checkoutData);

        // Listen for real-time updates
        const unsubscribe = onSnapshot(collection(firestore, "Pemesanan"), (snapshot) => {
          const updatedData = [];
          snapshot.forEach((doc) => {
            updatedData.push({ id: doc.id, ...doc.data() });
          });
          setPesanan(updatedData);
        });

        // Unsubscribe from real-time updates when component unmounts
        return () => unsubscribe();
      } catch (error) {
        console.error("Error", error);
      }
    };

    fetchData();
  }, []);

  const groupByPaket = () => {
    // Group the data by unique package IDs
    const groupedData = {};
    pesanan.forEach((checkoutItem) => {
      const packageId = checkoutItem.nama_paket;
      if (!groupedData[packageId]) {
        groupedData[packageId] = [];
      }
      groupedData[packageId].push(checkoutItem);
    });
    return groupedData;
  };

  const openModal = (image) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };
  
  const openPaymentModal = (image) => {
    setSelectedImage(image);
    setIsPaymentModalOpen(true);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateDoc(doc(firestore, "Pemesanan", editData.id), {
        status_pembayaran: isChecked ? "Lunas" : "Belum Lunas",
      });

      setIsModalOpen(false);
      setEditData(null);
    } catch (error) {
      console.error("Error updating status_pembayaran:", error);
    }
  };

  const renderTables = () => {
    const groupedData = groupByPaket();
    return Object.keys(groupedData).map((packageId) => (
      <table className="w-full table-auto " key={packageId}>
        <thead>
          <tr className="bg-gray-2 text-left dark:bg-meta-4 text-bold">
            <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
              Paket {packageId}
            </th>
            <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
              Total Harga
            </th>
            <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
              Tanggal
            </th>
            <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
              Jam
            </th>
            <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
              Studio Dipilih
            </th>
            <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
              Status pembayaran
            </th>
            <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
              Metode Pembayaran
            </th>
            <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
              Bukti Pembayaran
            </th>
            <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
              Rekening Pelanggan
            </th>
            <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
              Rekening Tujuan
            </th>
            <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
              Kode Pemesanan
            </th>
            <th className="py-4 px-4 font-medium text-black dark:text-white">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {groupedData[packageId].map((checkoutItem, index) => (
            <tr key={index}>
              <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                <h5 className="font-medium text-black dark:text-white">
                  {checkoutItem.nama_paket}
                </h5>
              </td>
              <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                <h5 className="font-medium text-black dark:text-white">
                  {checkoutItem.harga}
                </h5>
              </td>
              <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                <p className="text-black dark:text-white">
                  {checkoutItem.tanggal}
                </p>
              </td>
              <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                <p className="text-black dark:text-white">{checkoutItem.jam}</p>
              </td>
              <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                <p className="text-black dark:text-white">
                  {checkoutItem.studio_dipilih}
                </p>
              </td>
              <td
                className={`border-b border-[#eee] py-5 px-4 dark:border-strokedark ${
                  checkoutItem.status_pembayaran === "Lunas"
                    ? "text-success dark:text-success"
                    : "text-warning dark:text-warning"
                }`}
              >
                <p className="text- dark:text-white">
                  {checkoutItem.status_pembayaran}
                </p>
              </td>

              <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                <p className="text-black dark:text-white">
                  {checkoutItem.metode_pembayaran}
                </p>
              </td>
              <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                <div
                  className="h-12.5 w-15 rounded-md cursor-pointer"
                  onClick={() => openModal(checkoutItem.bukti_pembayaran)}
                >
                  <img
                    src={checkoutItem.bukti_pembayaran}
                    width={60}
                    height={50}
                  />
                </div>
              </td>
              <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                <p className="text-black dark:text-white">
                  {checkoutItem.rekening_pelanggan}
                </p>
              </td>
              <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                <p className="text-black dark:text-white">
                  {checkoutItem.rekening_tujuan}
                </p>
              </td>
              <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                <p className="inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium text-success bg-success">
                  {checkoutItem.kode_pemesanan}
                </p>
              </td>

              <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                <div className="flex items-center space-x-3.5">
                  <button
                    onClick={() => {
                      setEditData(checkoutItem);
                      setIsModalOpen(true);
                    }}
                    className="inline-flex items-center justify-center gap-2 bg-primary py-2 px-4 text-sm font-medium text-white hover:bg-opacity-90 lg:px-6 xl:px-7 w-auto rounded mb-2"
                  >
                    Edit
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    ));
  };

  return (
    <>
      <LayoutAuth>
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <div className="max-w-full overflow-x-auto">
            <div>{renderTables()}</div>
          </div>
        </div>

        <Modal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          contentLabel="Payment Proof Modal"
          style={{
            overlay: {
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            },
            content: {
              position: "relative",
              outline: "none",
              border: "none",
              background: "white",
              padding: "20px",
              borderRadius: "8px",
            },
          }}
        >
          <div className="flex justify-end">
            <button onClick={() => setIsModalOpen(false)}>Close</button>
          </div>
          <img src={selectedImage} alt="Payment Proof" />
        </Modal>
        <Modal
          isOpen={isModalOpen}
          onRequestClose={() => {
            setIsEditModalOpen(false);
            setEditData(null);
          }}
          contentLabel="Edit Modal"
          style={{
            overlay: {
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            },
            content: {
              position: "relative",
              outline: "none",
              border: "none",
              background: "white",
              padding: "20px",
              borderRadius: "8px",
              maxWidth: "400px",
              width: "100%",
            },
          }}
        >
          <div className="flex justify-end">
            <button onClick={() => setIsEditModalOpen(false)}>Close</button>
          </div>
          {editData && (
            <div>
              <form onSubmit={handleSubmit}>
                <label>
                  Status Pembayaran:
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => setIsChecked(!isChecked)}
                  />
                  Lunas
                </label>
                <br />
                <button type="submit">Submit</button>
              </form>
            </div>
          )}
        </Modal>
      </LayoutAuth>
    </>
  );
};

export default TableThree;
