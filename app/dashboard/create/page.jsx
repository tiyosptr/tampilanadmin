"use client";
import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import FirebaseConfig from "@/components/FirebaseConfig/FirebaseConfig";
import LayoutAuth from "@/components/LayoutAuth/page";
import { useRouter } from "next/navigation"; // Perubahan dari "next/navigation"
import Link from "next/link";

export default function Create() {
  const [nama_paket, setNamaPaket] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [orang, setOrang] = useState("");
  const [waktu, setWaktu] = useState("");
  const [ganti_pakaian, setGantiPakaian] = useState("");
  const [harga, setHarga] = useState(0);
  const [backgroundImages, setBackgroundImages] = useState([]);
  const [backgroundFiles, setBackgroundFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [keuntunganList, setKeuntunganList] = useState([""]);

  const db = FirebaseConfig().firestore;
  const storage = FirebaseConfig().storage; // Initialize Firebase Storage
  const router = useRouter();

  let isNullOrWhiteSpaces = (value) => {
    value = value.toString();
    return value == null || value.replaceAll("", "").length < 1;
  };

  const handleFileChange = (file) => {
    setSelectedFile(file);
  };

  const addBackgroundImageInput = () => {
    setBackgroundImages((prevImages) => [...prevImages, null]);
    setBackgroundFiles((prevFiles) => [...prevFiles, null]);
  };

  const addKeuntunganInput = () => {
    setKeuntunganList((prevList) => [...prevList, ""]);
  };

  const handleBackgroundFileChange = (file, index) => {
    const newFiles = [...backgroundFiles];
    newFiles[index] = file;
    setBackgroundFiles(newFiles);
  };

  const handleKeuntunganChange = (index, newValue) => {
    const newList = [...keuntunganList];
    newList[index] = newValue;
    setKeuntunganList(newList);
  };

  let MasukkanDataPaket = async () => {
    if (
      isNullOrWhiteSpaces(nama_paket) ||
      isNullOrWhiteSpaces(deskripsi) ||
      isNullOrWhiteSpaces(orang) ||
      isNullOrWhiteSpaces(waktu) ||
      isNullOrWhiteSpaces(ganti_pakaian) ||
      isNullOrWhiteSpaces(keuntunganList) ||
      isNullOrWhiteSpaces(harga)
    ) {
      alert("harap isi semua bidang");
      return;
    }

    const paketRef = doc(db, "Paket", nama_paket);
    const docSnap = await getDoc(paketRef);

    const backgroundStorageRefs = backgroundFiles.map(
      (file) => file && storageRef(storage, `images/${uuidv4()}_${file.name}`)
    );
    const backgroundDownloadURLs = await Promise.all(
      backgroundStorageRefs.map(async (storageRef, index) => {
        if (storageRef) {
          await uploadBytes(storageRef, backgroundFiles[index]);
          return await getDownloadURL(storageRef);
        }
        return null;
      })
    );

    const backgroundImagesData = {};
    backgroundDownloadURLs.forEach((url, index) => {
      if (url) {
        backgroundImagesData[`background_image_${index + 1}`] = url;
      }
    });

    const keuntunganData = {};
    keuntunganList.forEach((keuntungan, index) => {
      keuntunganData[`keuntungan_${index + 1}`] = keuntungan;
    });

    if (docSnap.exists()) {
      alert("Paket Sudah ada, gunakan nama paket yang berbeda");
    } else {
      const deskripsiList = deskripsi.split("n");
      const storagePaketRef = storageRef(
        storage,
        `images/${uuidv4()}_${selectedFile.name}`
      );

      if (selectedFile) {
        uploadBytes(storagePaketRef, selectedFile)
          .then(async (snapshot) => {
            console.log("File uploaded", snapshot);
            const downloadURL = await getDownloadURL(storagePaketRef);

            await addDoc(collection(db, "Paket"), {
              nama_paket: nama_paket,
              deskripsi: deskripsi,
              orang: orang,
              waktu: waktu,
              ganti_pakaian: ganti_pakaian,
              harga: harga,
              url_gambar: downloadURL,
              background_images: backgroundImagesData,
              keuntungan: keuntunganData,
            });

            alert("data berhasil ditambahkan");
            router.push("/dashboard");
          })
          .catch((error) => {
            console.error("error saat menambahkan data", error);
            alert("terjadi kesalahana");
          });
      } else {
        alert("pilih data terlebih dahulu");
      }
    }
  };

  return (
    <LayoutAuth>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 space-y-4">
        <div className="flex flex-col gap-6">
          <div>
            <label className="block text-black dark:text-white">
              Nama Paket
            </label>
            <input
              value={nama_paket}
              onChange={(e) => setNamaPaket(e.target.value)}
              type="text"
              placeholder="Masukkan Nama Paket"
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>
          <div>
            <label className=" block text-black dark:text-white">Studio</label>
            <input
              type="file"
              onChange={(e) => handleFileChange(e.target.files[0])}
              className="w-full rounded-md border border-stroke p-3 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm file:font-medium focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white"
            />
          </div>
          <div>
            <label className=" block text-black dark:text-white">
              Latar Belakang
            </label>
            {backgroundImages.map((_, index) => (
              <div key={index} className="mb-4">
                <input
                  type="file"
                  onChange={(e) =>
                    handleBackgroundFileChange(e.target.files[0], index)
                  }
                  className="w-full rounded-md border border-stroke p-3 outline-none transition file:mr-4 file:rounded file:border-[0.5px] file:border-stroke file:bg-[#EEEEEE] file:py-1 file:px-2.5 file:text-sm file:font-medium focus:border-primary file:focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-strokedark dark:file:bg-white/30 dark:file:text-white"
                />
              </div>
            ))}
            <button
              onClick={addBackgroundImageInput}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Tambah Latar Belakang
            </button>
          </div>
          <div>
            <label className="block text-black dark:text-white">
              Deskripsi
            </label>
            <textarea
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              rows={6}
              placeholder="Masukkan Deskriprsi Paket"
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            ></textarea>
          </div>
          <div>
            <label className="block text-black dark:text-white">
              Jumlah Orang
            </label>
            <input
              value={orang}
              onChange={(e) => setOrang(e.target.value)}
              type="text"
              placeholder="Masukkan Jumlah Orang"
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-black dark:text-white">Waktu</label>
            <input
              value={waktu}
              onChange={(e) => setWaktu(e.target.value)}
              type="text"
              placeholder="Masukkan Nama Paket Foto"
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-black dark:text-white">
              Ganti Pakaian
            </label>
            <input
              value={ganti_pakaian}
              onChange={(e) => setGantiPakaian(e.target.value)}
              type="text"
              placeholder="Masukkan Ganti Pakaian"
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-black dark:text-white">
              Keuntungan
            </label>
            {keuntunganList.map((keuntungan, index) => (
              <div key={index} className="mb-4">
                <input
                  value={keuntungan}
                  onChange={(e) =>
                    handleKeuntunganChange(index, e.target.value)
                  }
                  type="text"
                  placeholder="Masukkan Keuntungan"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                />
              </div>
            ))}
            <button
              onClick={addKeuntunganInput}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Tambah Keuntungan
            </button>
          </div>

          <div>
            <label className="mb-3 block text-black dark:text-white">
              Harga
            </label>
            <input
              value={harga}
              onChange={(e) => setHarga(parseInt(e.target.value, 10))}
              type="number" // Change the input type to "number"
              placeholder="Masukkan Harga Paket"
              className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>
        </div>
      </div>

      <button
        onClick={MasukkanDataPaket}
        className="inline-flex items-center justify-center gap-2.5 bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
      >
        Masukkan Data
      </button>
    </LayoutAuth>
  );
}
