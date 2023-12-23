"use client"
import React, { useEffect, useState } from 'react';
import Link from "next/link";
import Image from "next/image";
import LayoutAuth from "@/components/LayoutAuth/page";
import FirebaseConfig from "@/components/FirebaseConfig/FirebaseConfig";
import { collection, getDocs, query, orderBy, getDoc, doc, getFirestore } from 'firebase/firestore';

const firestore = FirebaseConfig().firestore;

const ChatCard = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const messagesCollection = collection(firestore, 'messages');
        const messagesQuery = query(messagesCollection, orderBy('timestamp'));

        const messagesSnapshot = await getDocs(messagesQuery);
        const messagesData = messagesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        setMessages(messagesData);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchData();
  }, []);

 

  return (
    <LayoutAuth>
    <div className="max-w-screen-xl mx-auto bg-white shadow-default dark:bg-boxdark dark:border-strokedark border border-stroke rounded-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-xl font-semibold text-black dark:text-white">
          Chats
        </h4>
        <input
          type="text"
          name=""
          id=""
          placeholder="Search Name"
          className="items-center rounded-2xl bg-gray-100 py-3 px-5 w-60"
        />
      </div>

      <div className="flex">
        <div className="w-1/2 border-r pr-4 overflow-y-auto">
        {messages.map((message) => (
        <div key={message.id} >
              <div className="flex items-center gap-5 py-3 px-7.5 hover:bg-gray-300 dark:hover:bg-meta-4">
                <div className="relative h-14 w-14 rounded-full">
                  
                  <span
                    className='absolute right-0 bottom-0 h-3.5 w-3.5 rounded-full border-2 border-white'
                  ></span>
                </div>
                <div className="flex-1 items-center justify-between">
                  <div>
                    <h5 className="font-medium text-black dark:text-white">
                    {message.senderEmail}
                    </h5>
                    <p>
                      <span className="text-sm text-black dark:text-white">
                      {message.message}
                      </span>
                      <span className="text-xs">{message.timestamp.toDate().toString()}</span>
                    </p>
                  </div>
         
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                      <span className="text-sm font-medium text-white">
                        ajbsdas
                      </span>
                    </div>

                </div>
              </div>
             
            </div>
             ))}
        </div>

        <div className="w-1/2 pl-4">
          <div className="flex flex-col mt-5 pl-5">
            <div className="flex justify-end mb-4">
              <div className="mr-2 py-3 px-4 bg-primary rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white">
                Welcome to the group, everyone!
              </div>
              <img
                src="https://source.unsplash.com/vpOeXr5wmR4/600x600"
                className="object-cover h-8 w-8 rounded-full"
                alt=""
              />
            </div>
            <div className="flex justify-start mb-4">
              <img
                src="https://source.unsplash.com/vpOeXr5wmR4/600x600"
                class="object-cover h-8 w-8 rounded-full"
                alt=""
              />
              <div className="ml-2 py-3 px-4 bg-primary rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-white">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat
              </div>
            </div>
            {/* ... (pesan lainnya) */}
          </div>
          <div className="py-5">
            <input
              className="w-full bg-gray-300 py-5 px-3 rounded-xl"
              type="text"
              placeholder="Type your message here..."
            />
          </div>
        </div>
      </div>
    </div>
  </LayoutAuth>
  );
};

export default ChatCard;
