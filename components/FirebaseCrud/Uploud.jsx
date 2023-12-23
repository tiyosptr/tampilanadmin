"use client";
import { useState, useEffect } from "react";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
} from "firebase/storage";
import FirebaseConfig from "../FirebaseConfig/FirebaseConfig";
import { v4 } from "uuid";
import Image from "next/image";

const storage = FirebaseConfig().storage;

function Uploud() {
  const [imageUpload, setImageUpload] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);

  const imagesListRef = ref(storage, "images/");

  const uploadFile = () => {
    if (imageUpload == null) return;
    const imageName = `${imageUpload.name}_${v4()}`;
    const imageRef = ref(storage, `images/${imageName}`);
    uploadBytes(imageRef, imageUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setImageUrls((prev) => [...prev, url]);
      });
    });
  };

  useEffect(() => {
    listAll(imagesListRef)
      .then((response) => {
        return Promise.all(
          response.items.map((item) => getDownloadURL(item))
        );
      })
      .then((urls) => {
        setImageUrls(urls);
      })
      .catch((error) => {
        console.error("Error fetching images:", error);
      });
  }, []);

  return (
    <div className="App">
      <input
        type="file"
        onChange={(event) => {
          setImageUpload(event.target.files[0]);
        }}
      />
      <button onClick={uploadFile}>Upload Image</button>
      {imageUrls.map((url, index) => (
        <Image key={index} src={url} alt={`Image ${index}`} />
      ))}
    </div>
  );
}

export default Uploud;
