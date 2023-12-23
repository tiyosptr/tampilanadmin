"use client";
import LayoutAuth from "@/components/LayoutAuth/page";
import React, { useState } from "react";

const Testing = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "John",
      message: "Hello there!",
    },
    {
      id: 2,
      sender: "Jane",
      message: "Hi John!",
    },
    // ...data chat lainnya
  ]);
  const [newMessage, setNewMessage] = useState("");

  const sendMessage = () => {
    if (newMessage.trim() !== "") {
      const newMsg = {
        id: messages.length + 1,
        sender: "You",
        message: newMessage,
      };
      setMessages([...messages, newMsg]);
      setNewMessage("");
    }
  };

  return (
    <LayoutAuth>
      <div className="container mx-auto shadow-lg rounded-lg">
        {/* <!-- ===== Header Start ===== --> */}
        <div className="px-5 py-5 flex justify-between items-center bg-white border-b-2">
          <div className="font-semibold text-2xl">Mollery Chat</div>
          <div className="w-1/2">
            <input
              type="text"
              name=""
              id=""
              placeholder="Search Name"
              className="rounded-2xl bg-gray-100 py-3 px-5 w-full"
            />
          </div>
          <div className="h-12 w-12 p-2 bg-warning rounded-full text-white font-semibold flex items-center justify-center">
            RA
          </div>
        </div>
        {/* <!-- ===== Header Start ===== --> */}
        {/* <!-- ===== Chat start ===== --> */}
        <div className="flex flex-row justify-between bg-white">
          {/* <!-- ===== Chat List Start ===== --> */}
          <div className="flex flex-col w-2/5 border-r-2 overflow-y-auto">
            {/* <!-- ===== Search Prompt Start ===== --> */}
            <div className="border-b-2 py-4 px-2">
              <input
                type="text"
                placeholder="search chatting"
                className="py-2 px-2 border-2 border-gray-200 rounded-2xl w-full"
              />
            </div>
            {/* <!-- ===== Search Prompt End ===== --> */}
            {/* <!-- ===== User List Start ===== --> */}
            {/* <!-- ===== User List End ===== --> */}
          </div>
        </div>
        {/* <!-- ===== Chat List End ===== --> */}
        {/* <!-- ===== Message Start ===== --> */}
        <div className="w-full px-5 flex flex-col justify-between">
          <div className="flex flex-col mt-5">
            <div className="flex justify-end mb-4">
              <div className="mr-2 py-3 px-4 bg-primary rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white">
                Welcome to group everyone !
              </div>
              <img
                src="https://source.unsplash.com/vpOeXr5wmR4/600x600"
                class="object-cover h-8 w-8 rounded-full"
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
            <div className="flex justify-end mb-4">
              <div>
                <div className="mr-2 py-3 px-4 bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white">
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                  Magnam, repudiandae.
                </div>
                <div className="mt-4 mr-2 py-3 px-4 bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Debitis, reiciendis!
                </div>
              </div>
              <img
                src="https://source.unsplash.com/vpOeXr5wmR4/600x600"
                class="object-cover h-8 w-8 rounded-full"
                alt=""
              />
            </div>
            <div className="flex justify-start mb-4">
              <img
                src="https://source.unsplash.com/vpOeXr5wmR4/600x600"
                class="object-cover h-8 w-8 rounded-full"
                alt=""
              />
              <div className="ml-2 py-3 px-4 bg-gray-400 rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-white">
                Happy Holiday Guys!
              </div>
            </div>
          </div>
          <div className="py-5">
            <input
              className="w-full bg-gray-300 py-5 px-3 rounded-xl"
              type="text"
              placeholder="type you message here..."
            />
          </div>
        </div>
        {/* <!-- ===== Message End ===== --> */}
      </div>
    </LayoutAuth>
  );
};

export default Testing;
